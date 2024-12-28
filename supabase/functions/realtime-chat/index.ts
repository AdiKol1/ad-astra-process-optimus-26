// Follow Deno Deploy best practices for WebSocket handling
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-session-id',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
};

console.log('Edge Function initializing...');

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
    console.log('Attempting WebSocket upgrade...');
    const { socket, response } = Deno.upgradeWebSocket(req);
    const sessionId = crypto.randomUUID();
    console.log(`New WebSocket connection established. Session ID: ${sessionId}`);

    socket.onopen = () => {
      console.log(`[${sessionId}] WebSocket opened`);
      // Send initial connection success message
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
        
        // Handle ping messages
        if (data.type === 'ping') {
          socket.send(JSON.stringify({
            type: 'pong',
            timestamp: Date.now(),
            sessionId
          }));
          return;
        }

        // Echo the message back for testing
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

    // Add CORS headers to the upgrade response
    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;
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