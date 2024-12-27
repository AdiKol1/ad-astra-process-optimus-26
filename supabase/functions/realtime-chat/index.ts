import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Vary': 'Origin'
}

serve(async (req) => {
  const requestId = crypto.randomUUID();
  console.log(`[${requestId}] Request received:`, {
    method: req.method,
    url: req.url,
    headers: Object.fromEntries(req.headers.entries())
  });

  try {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
      console.log(`[${requestId}] Handling CORS preflight`);
      return new Response(null, { headers: corsHeaders });
    }

    // Handle WebSocket upgrade
    const upgrade = req.headers.get('upgrade') || '';
    if (upgrade.toLowerCase() === 'websocket') {
      console.log(`[${requestId}] Processing WebSocket upgrade request`);
      
      const { socket, response } = Deno.upgradeWebSocket(req);
      
      socket.onopen = () => {
        console.log(`[${requestId}] WebSocket connection opened`);
        socket.send(JSON.stringify({
          type: 'connection.established',
          timestamp: Date.now(),
          requestId
        }));
      };

      socket.onmessage = (event) => {
        console.log(`[${requestId}] Message received:`, event.data);
        try {
          const data = JSON.parse(event.data);
          socket.send(JSON.stringify({
            type: 'message.received',
            data,
            timestamp: Date.now(),
            requestId
          }));
        } catch (error) {
          console.error(`[${requestId}] Error processing message:`, error);
          socket.send(JSON.stringify({
            type: 'error',
            error: 'Failed to process message',
            timestamp: Date.now(),
            requestId
          }));
        }
      };

      socket.onerror = (event) => {
        console.error(`[${requestId}] WebSocket error:`, event);
      };

      socket.onclose = (event) => {
        console.log(`[${requestId}] WebSocket closed:`, {
          code: event.code,
          reason: event.reason || 'No reason provided',
          wasClean: event.wasClean
        });
      };

      // Add CORS headers to upgrade response
      Object.entries(corsHeaders).forEach(([key, value]) => {
        response.headers.set(key, value);
      });

      return response;
    }

    // Handle HTTP request (health check)
    console.log(`[${requestId}] Handling HTTP request`);
    return new Response(
      JSON.stringify({ 
        status: 'healthy',
        timestamp: new Date().toISOString(),
        requestId
      }), 
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );

  } catch (error) {
    console.error(`[${requestId}] Error handling request:`, error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        requestId,
        details: error instanceof Error ? error.message : String(error)
      }), 
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  }
});