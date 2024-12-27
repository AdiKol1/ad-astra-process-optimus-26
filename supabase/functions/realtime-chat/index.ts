import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
  'Vary': 'Origin'
};

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

    // Get auth token from query param or header
    const url = new URL(req.url);
    const authToken = url.searchParams.get('auth') || 
                     req.headers.get('authorization')?.replace('Bearer ', '');

    // Handle WebSocket upgrade
    const upgrade = req.headers.get('upgrade') || '';
    if (upgrade.toLowerCase() === 'websocket') {
      console.log(`[${requestId}] Processing WebSocket upgrade request`);
      
      try {
        const { socket, response } = Deno.upgradeWebSocket(req);
        
        // Add CORS and upgrade headers
        Object.entries({
          ...corsHeaders,
          'Upgrade': 'websocket',
          'Connection': 'Upgrade'
        }).forEach(([key, value]) => {
          response.headers.set(key, value);
        });

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

        socket.onerror = (e) => {
          console.error(`[${requestId}] WebSocket error:`, e);
        };

        socket.onclose = (e) => {
          console.log(`[${requestId}] WebSocket closed:`, {
            code: e.code,
            reason: e.reason || 'No reason provided',
            wasClean: e.wasClean
          });
        };

        return response;

      } catch (error) {
        console.error(`[${requestId}] WebSocket upgrade failed:`, error);
        return new Response(
          JSON.stringify({ 
            error: 'WebSocket upgrade failed',
            details: error instanceof Error ? error.message : String(error),
            requestId 
          }), 
          { 
            status: 426,
            headers: { 
              ...corsHeaders,
              'Content-Type': 'application/json'
            }
          }
        );
      }
    }

    // Handle HTTP request (health check)
    return new Response(JSON.stringify({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      requestId
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    console.error(`[${requestId}] Error handling request:`, error);
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