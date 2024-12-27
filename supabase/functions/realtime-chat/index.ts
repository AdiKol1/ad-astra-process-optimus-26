import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
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

    // Get API key from Authorization header
    const authHeader = req.headers.get('Authorization');
    const apiKey = authHeader ? authHeader.replace('Bearer ', '') : null;
    
    if (!apiKey) {
      console.error(`[${requestId}] No API key provided`);
      return new Response(
        JSON.stringify({ 
          error: 'No API key provided',
          requestId 
        }), 
        { 
          status: 401,
          headers: { 
            ...corsHeaders,
            'Content-Type': 'application/json'
          }
        }
      );
    }

    // Handle HTTP health check
    if (req.method === 'GET') {
      console.log(`[${requestId}] Handling health check`);
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
    }

    const upgrade = req.headers.get('upgrade') || '';
    if (upgrade.toLowerCase() !== 'websocket') {
      console.log(`[${requestId}] Not a WebSocket upgrade request`);
      return new Response('Expected WebSocket upgrade', { 
        status: 426,
        headers: corsHeaders
      });
    }

    console.log(`[${requestId}] Processing WebSocket upgrade request`);
    const { socket, response } = Deno.upgradeWebSocket(req);

    socket.onopen = () => {
      console.log(`[${requestId}] Client WebSocket opened`);
      try {
        socket.send(JSON.stringify({ 
          type: 'connection.success',
          timestamp: Date.now(),
          requestId
        }));
      } catch (err) {
        console.error(`[${requestId}] Error sending success message:`, err);
      }
    };

    socket.onmessage = async (event) => {
      console.log(`[${requestId}] Received message:`, event.data);
      try {
        const data = JSON.parse(event.data);
        
        // Echo the message back for testing
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

    // Add CORS headers to the upgrade response
    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;

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