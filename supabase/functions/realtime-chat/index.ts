import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
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
          'Content-Type': 'application/json',
          'Upgrade': 'websocket'
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
      
      socket.send(JSON.stringify({
        type: 'connection.established',
        timestamp: Date.now(),
        requestId
      }));
    };

    socket.onmessage = (event) => {
      console.log(`[${requestId}] Message from client:`, event.data);
      const conn = activeConnections.get(requestId);
      if (conn) {
        conn.lastActive = Date.now();
      }
      
      try {
        const message = JSON.parse(event.data);
        socket.send(JSON.stringify({
          type: 'message.received',
          data: message,
          timestamp: Date.now(),
          requestId
        }));
      } catch (err) {
        console.error(`[${requestId}] Error processing message:`, err);
        socket.send(JSON.stringify({
          type: 'error',
          message: 'Invalid message format',
          timestamp: Date.now(),
          requestId
        }));
      }
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