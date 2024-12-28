import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const activeConnections = new Map();

serve(async (req) => {
  const requestId = crypto.randomUUID();
  const clientIP = req.headers.get('x-forwarded-for') || 'unknown';
  
  console.log(`[${requestId}] New request:`, {
    method: req.method,
    url: req.url,
    clientIP,
    headers: Object.fromEntries(req.headers.entries())
  });

  try {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
      console.log(`[${requestId}] Handling CORS preflight`);
      return new Response('ok', { headers: corsHeaders });
    }

    // Check for WebSocket upgrade
    const upgrade = req.headers.get('upgrade') || '';
    if (upgrade.toLowerCase() !== 'websocket') {
      console.log(`[${requestId}] Not a WebSocket upgrade request`);
      return new Response(JSON.stringify({
        error: 'Protocol error',
        message: 'Expected WebSocket upgrade',
        requestId
      }), { 
        status: 426,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }

    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      console.error(`[${requestId}] OpenAI API key not configured`);
      return new Response(JSON.stringify({
        error: 'Configuration error',
        message: 'OpenAI API key not configured',
        requestId
      }), { 
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }

    console.log(`[${requestId}] Creating WebSocket connection`);
    
    const { socket, response } = Deno.upgradeWebSocket(req);
    
    // Add CORS headers to upgrade response
    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    // Track the connection
    activeConnections.set(requestId, {
      socket,
      lastActive: Date.now(),
      clientIP
    });

    socket.onopen = () => {
      console.log(`[${requestId}] Client WebSocket connection opened from ${clientIP}`);
      
      const openaiUrl = 'wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-10-01';
      console.log(`[${requestId}] Connecting to OpenAI WebSocket`);
      
      const openaiWS = new WebSocket(openaiUrl, [
        'realtime',
        `openai-insecure-api-key.${OPENAI_API_KEY}`,
        'openai-beta.realtime-v1',
      ]);

      openaiWS.onopen = () => {
        console.log(`[${requestId}] Connected to OpenAI`);
        socket.send(JSON.stringify({
          type: 'connection.established',
          timestamp: Date.now(),
          requestId,
          diagnostics: {
            clientIP,
            userAgent: req.headers.get('user-agent') || 'unknown'
          }
        }));
      };

      openaiWS.onmessage = (event) => {
        console.log(`[${requestId}] Message from OpenAI:`, event.data);
        socket.send(event.data);
      };

      openaiWS.onerror = (error) => {
        console.error(`[${requestId}] OpenAI WebSocket error:`, error);
        socket.send(JSON.stringify({
          type: 'error',
          message: 'OpenAI connection error',
          timestamp: Date.now(),
          requestId,
          diagnostics: {
            clientIP,
            userAgent: req.headers.get('user-agent') || 'unknown'
          }
        }));
      };

      openaiWS.onclose = (event) => {
        console.log(`[${requestId}] OpenAI connection closed:`, {
          code: event.code,
          reason: event.reason,
          wasClean: event.wasClean
        });
        socket.close(event.code, event.reason);
      };

      socket.onmessage = (event) => {
        console.log(`[${requestId}] Message from client:`, event.data);
        const conn = activeConnections.get(requestId);
        if (conn) {
          conn.lastActive = Date.now();
        }
        
        if (openaiWS.readyState === WebSocket.OPEN) {
          openaiWS.send(event.data);
        } else {
          console.error(`[${requestId}] OpenAI WebSocket not ready`);
          socket.send(JSON.stringify({
            type: 'error',
            message: 'OpenAI connection not ready',
            timestamp: Date.now(),
            requestId,
            diagnostics: {
              clientIP,
              userAgent: req.headers.get('user-agent') || 'unknown',
              openaiReadyState: openaiWS.readyState
            }
          }));
        }
      };
    };

    socket.onerror = (error) => {
      console.error(`[${requestId}] Client WebSocket error from ${clientIP}:`, error);
    };

    socket.onclose = (event) => {
      console.log(`[${requestId}] Client WebSocket closed from ${clientIP}:`, {
        code: event.code,
        reason: event.reason,
        wasClean: event.wasClean
      });
      activeConnections.delete(requestId);
    };

    return response;

  } catch (error) {
    console.error(`[${requestId}] Unhandled error:`, error);
    return new Response(JSON.stringify({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : String(error),
      requestId,
      diagnostics: {
        clientIP,
        userAgent: req.headers.get('user-agent') || 'unknown'
      }
    }), {
      status: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  }
});

// Cleanup inactive connections every minute
setInterval(() => {
  const now = Date.now();
  for (const [id, conn] of activeConnections.entries()) {
    if (now - conn.lastActive > 300000) { // 5 minutes
      console.log(`[${id}] Cleaning up inactive connection from ${conn.clientIP}`);
      if (conn.socket.readyState === WebSocket.OPEN) {
        conn.socket.close(1000, 'Connection timeout');
      }
      activeConnections.delete(id);
    }
  }
}, 60000);