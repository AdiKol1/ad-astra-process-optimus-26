import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  const requestId = crypto.randomUUID();
  
  try {
    console.log(`[${requestId}] New request received:`, {
      method: req.method,
      url: req.url,
      headers: Object.fromEntries(req.headers.entries())
    });

    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
      console.log(`[${requestId}] Handling CORS preflight request`);
      return new Response(null, { headers: corsHeaders });
    }

    // Check for WebSocket upgrade
    const upgrade = req.headers.get('upgrade') || '';
    if (upgrade.toLowerCase() !== 'websocket') {
      console.log(`[${requestId}] Not a WebSocket upgrade request`);
      return new Response('Expected WebSocket upgrade', { 
        status: 426,
        headers: corsHeaders
      });
    }

    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      console.error(`[${requestId}] OpenAI API key not configured`);
      return new Response('OpenAI API key not configured', { 
        status: 500,
        headers: corsHeaders
      });
    }

    console.log(`[${requestId}] Creating WebSocket connection`);
    
    // Create WebSocket connection
    const { socket, response } = Deno.upgradeWebSocket(req);
    
    // Add CORS headers to upgrade response
    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    socket.onopen = () => {
      console.log(`[${requestId}] Client WebSocket connection opened`);
      
      // Initialize OpenAI WebSocket connection
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
          requestId
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
          requestId
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

      // Handle messages from client
      socket.onmessage = (event) => {
        console.log(`[${requestId}] Message from client:`, event.data);
        if (openaiWS.readyState === WebSocket.OPEN) {
          openaiWS.send(event.data);
        } else {
          console.error(`[${requestId}] OpenAI WebSocket not ready`);
          socket.send(JSON.stringify({
            type: 'error',
            message: 'OpenAI connection not ready',
            timestamp: Date.now(),
            requestId
          }));
        }
      };
    };

    socket.onerror = (error) => {
      console.error(`[${requestId}] Client WebSocket error:`, error);
    };

    socket.onclose = (event) => {
      console.log(`[${requestId}] Client WebSocket closed:`, {
        code: event.code,
        reason: event.reason,
        wasClean: event.wasClean
      });
    };

    return response;

  } catch (error) {
    console.error(`[${requestId}] Unhandled error:`, error);
    return new Response(JSON.stringify({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : String(error),
      requestId
    }), {
      status: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  }
});