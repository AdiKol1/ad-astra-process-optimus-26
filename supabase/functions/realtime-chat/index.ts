// Constants for connection management
const PING_INTERVAL = 15000;
const PONG_TIMEOUT = 5000;
const CLEANUP_INTERVAL = 30000;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-connection-id',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Max-Age': '86400'
};

// Track active connections and their state
interface ConnectionState {
  socket: WebSocket;
  lastPing: number;
  lastPong: number;
  messageCount: number;
  pingInterval?: number;
  errors: Array<{ timestamp: number; message: string }>;
}

const connections = new Map<string, ConnectionState>();

// Cleanup routine for stale connections
setInterval(() => {
  const now = Date.now();
  for (const [id, state] of connections) {
    if (now - state.lastPong > PING_INTERVAL + PONG_TIMEOUT) {
      console.log(`[${id}] Connection stale - closing`);
      state.socket.close(4000, 'Connection stale');
      clearInterval(state.pingInterval);
      connections.delete(id);
    }
  }
}, CLEANUP_INTERVAL);

console.log('Edge Function starting...');

Deno.serve(async (req) => {
  const connectionId = crypto.randomUUID();
  console.log(`[${connectionId}] Request received:`, {
    method: req.method,
    url: new URL(req.url).pathname,
    headers: Object.fromEntries(req.headers.entries())
  });

  try {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
      return new Response(null, { 
        status: 204,
        headers: corsHeaders 
      });
    }

    // Handle health check
    if (req.method === 'GET' && !req.headers.get('upgrade')) {
      return new Response(JSON.stringify({
        status: 'healthy',
        activeConnections: connections.size,
        timestamp: new Date().toISOString()
      }), {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
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

    const { socket, response } = Deno.upgradeWebSocket(req);
    console.log(`[${connectionId}] New WebSocket connection attempt`);

    const state: ConnectionState = {
      socket,
      lastPing: Date.now(),
      lastPong: Date.now(),
      messageCount: 0,
      errors: []
    };

    socket.onopen = () => {
      console.log(`[${connectionId}] WebSocket opened successfully`);
      
      // Start ping interval
      state.pingInterval = setInterval(() => {
        if (socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify({
            type: 'ping',
            timestamp: Date.now(),
            connectionId
          }));
          state.lastPing = Date.now();
        }
      }, PING_INTERVAL);

      // Send connection confirmation
      socket.send(JSON.stringify({
        type: 'connected',
        connectionId,
        timestamp: Date.now()
      }));
    };

    socket.onmessage = async (event) => {
      try {
        console.log(`[${connectionId}] Message received:`, event.data);
        const message = JSON.parse(event.data);
        state.messageCount++;
        
        switch (message.type) {
          case 'ping':
            state.lastPing = Date.now();
            socket.send(JSON.stringify({
              type: 'pong',
              timestamp: Date.now(),
              connectionId
            }));
            break;
            
          case 'pong':
            state.lastPong = Date.now();
            break;
            
          default:
            socket.send(JSON.stringify({
              type: 'message.echo',
              data: message,
              timestamp: Date.now(),
              connectionId
            }));
        }
      } catch (error) {
        console.error(`[${connectionId}] Error processing message:`, error);
        state.errors.push({
          timestamp: Date.now(),
          message: error instanceof Error ? error.message : String(error)
        });
        
        socket.send(JSON.stringify({
          type: 'error',
          error: 'Failed to process message',
          timestamp: Date.now(),
          connectionId
        }));
      }
    };

    socket.onerror = (error) => {
      console.error(`[${connectionId}] WebSocket error:`, error);
      state.errors.push({
        timestamp: Date.now(),
        message: 'WebSocket error event'
      });
    };

    socket.onclose = (event) => {
      console.log(`[${connectionId}] WebSocket closed:`, {
        code: event.code,
        reason: event.reason,
        wasClean: event.wasClean,
        state: {
          messageCount: state.messageCount,
          errors: state.errors,
          lastPing: new Date(state.lastPing).toISOString(),
          lastPong: new Date(state.lastPong).toISOString()
        }
      });
      
      clearInterval(state.pingInterval);
      connections.delete(connectionId);
    };

    // Store connection state
    connections.set(connectionId, state);

    // Return response with CORS headers
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
      details: error instanceof Error ? error.message : String(error)
    }), {
      status: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  }
});