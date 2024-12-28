const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

console.log('Edge Function starting...');

// Track active connections and their state
const activeConnections = new Map();
const connectionStates = new Map();

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
    console.log(`[${sessionId}] New WebSocket connection attempt`);

    // Initialize connection state
    connectionStates.set(sessionId, {
      lastPing: Date.now(),
      messageCount: 0,
      errors: [],
    });

    // Track connection
    activeConnections.set(sessionId, socket);

    socket.onopen = () => {
      console.log(`[${sessionId}] WebSocket opened successfully`);
      
      // Send connection confirmation
      try {
        socket.send(JSON.stringify({
          type: 'connected',
          sessionId,
          timestamp: Date.now()
        }));
      } catch (err) {
        console.error(`[${sessionId}] Error sending connection confirmation:`, err);
      }
    };

    socket.onmessage = async (event) => {
      try {
        console.log(`[${sessionId}] Message received:`, event.data);
        const data = JSON.parse(event.data);
        
        // Update connection state
        const state = connectionStates.get(sessionId);
        state.messageCount++;
        connectionStates.set(sessionId, state);
        
        // Handle ping messages
        if (data.type === 'ping') {
          state.lastPing = Date.now();
          socket.send(JSON.stringify({
            type: 'pong',
            timestamp: Date.now(),
            sessionId
          }));
          return;
        }

        // Echo message back with session tracking
        socket.send(JSON.stringify({
          type: 'message.echo',
          data,
          timestamp: Date.now(),
          sessionId
        }));
      } catch (error) {
        console.error(`[${sessionId}] Error processing message:`, error);
        const state = connectionStates.get(sessionId);
        state.errors.push({
          timestamp: Date.now(),
          error: error.message
        });
        connectionStates.set(sessionId, state);
        
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
      const state = connectionStates.get(sessionId);
      if (state) {
        state.errors.push({
          timestamp: Date.now(),
          error: 'WebSocket error event'
        });
        connectionStates.set(sessionId, state);
      }
    };

    socket.onclose = () => {
      console.log(`[${sessionId}] WebSocket closed:`, {
        state: connectionStates.get(sessionId)
      });
      activeConnections.delete(sessionId);
      connectionStates.delete(sessionId);
    };

    // Create new response with combined headers
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
    return new Response(JSON.stringify({ 
      error: 'Failed to establish WebSocket connection',
      details: error.message 
    }), {
      status: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  }
});