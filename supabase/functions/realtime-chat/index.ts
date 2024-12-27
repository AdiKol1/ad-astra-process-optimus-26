import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
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
    if (upgrade.toLowerCase() != 'websocket') {
      console.log(`[${requestId}] Not a WebSocket upgrade request`);
      return new Response('Expected WebSocket upgrade', { 
        status: 426,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }

    // Get API key from header or URL params
    const apikey = req.headers.get('apikey') || new URL(req.url).searchParams.get('apikey');
    if (!apikey) {
      console.error(`[${requestId}] No API key provided`);
      return new Response(JSON.stringify({ 
        error: 'Missing API key' 
      }), {
        status: 401,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }

    try {
      const { socket, response } = Deno.upgradeWebSocket(req);
      
      // Add CORS headers to the upgrade response
      Object.entries(corsHeaders).forEach(([key, value]) => {
        response.headers.set(key, value);
      });

      socket.onopen = () => {
        console.log(`[${requestId}] WebSocket connection opened`);
        socket.send(JSON.stringify({
          type: 'connection.established',
          timestamp: Date.now(),
          requestId
        }));

        // Set up a ping interval to keep the connection alive
        const pingInterval = setInterval(() => {
          if (socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({ type: 'ping', timestamp: Date.now() }));
          } else {
            clearInterval(pingInterval);
          }
        }, 30000); // Send ping every 30 seconds

        socket.onclose = () => {
          clearInterval(pingInterval);
          console.log(`[${requestId}] WebSocket connection closed`);
        };
      };

      socket.onmessage = (event) => {
        console.log(`[${requestId}] Message received:`, event.data);
        try {
          const data = JSON.parse(event.data);
          
          // Handle ping messages
          if (data.type === 'ping') {
            socket.send(JSON.stringify({
              type: 'pong',
              timestamp: Date.now(),
              requestId
            }));
            return;
          }

          // Handle auth messages
          if (data.type === 'auth') {
            socket.send(JSON.stringify({
              type: 'auth',
              status: 'authenticated',
              timestamp: Date.now(),
              requestId
            }));
            return;
          }

          // Echo back the message for testing
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
          status: 500,
          headers: { 
            ...corsHeaders,
            'Content-Type': 'application/json'
          }
        }
      );
    }

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