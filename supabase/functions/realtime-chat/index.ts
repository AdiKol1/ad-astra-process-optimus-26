// Follow Deno Deploy best practices for WebSocket handling
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      status: 204,
      headers: corsHeaders 
    });
  }

  const upgrade = req.headers.get('upgrade') || '';
  if (upgrade.toLowerCase() !== 'websocket') {
    return new Response('Expected WebSocket upgrade', { 
      status: 426,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  }

  try {
    const { socket, response } = Deno.upgradeWebSocket(req);
    const sessionId = crypto.randomUUID();
    console.log(`New WebSocket connection established. Session ID: ${sessionId}`);

    socket.onopen = () => {
      console.log(`[${sessionId}] WebSocket opened`);
      socket.send(JSON.stringify({
        type: 'connected',
        sessionId,
        timestamp: Date.now()
      }));
    };

    socket.onmessage = async (event) => {
      try {
        console.log(`[${sessionId}] Message received:`, event.data);
        const data = JSON.parse(event.data);
        
        if (data.type === 'ping') {
          socket.send(JSON.stringify({
            type: 'pong',
            timestamp: Date.now(),
            sessionId
          }));
          return;
        }

        socket.send(JSON.stringify({
          type: 'message.echo',
          data,
          timestamp: Date.now(),
          sessionId
        }));
      } catch (error) {
        console.error(`[${sessionId}] Error processing message:`, error);
        socket.send(JSON.stringify({
          type: 'error',
          error: 'Failed to process message',
          timestamp: Date.now(),
          sessionId
        }));
      }
    };

    socket.onerror = (error) => {
      console.error(`[${sessionId}] WebSocket error:`, error);
    };

    socket.onclose = () => {
      console.log(`[${sessionId}] WebSocket closed`);
    };

    // Create a new response with CORS headers
    const responseWithCors = new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: {
        ...Object.fromEntries(response.headers.entries()),
        ...corsHeaders
      }
    });

    return responseWithCors;
  } catch (error) {
    console.error('Error handling WebSocket connection:', error);
    return new Response(JSON.stringify({ error: 'Failed to establish WebSocket connection' }), {
      status: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  }
});