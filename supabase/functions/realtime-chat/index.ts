import { corsHeaders } from './constants.ts';
import { connectionManager } from './connection-manager.ts';
import { handleMessage } from './message-handler.ts';

console.log('Edge Function starting...');

// Set up periodic cleanup
setInterval(() => {
  connectionManager.cleanup();
}, 30000);

Deno.serve(async (req) => {
  // Generate a unique connection ID
  const connectionId = crypto.randomUUID();
  const clientId = req.headers.get('x-client-id') || connectionId;

  console.log(`[${connectionId}] Request received:`, {
    method: req.method,
    url: new URL(req.url).pathname,
    headers: Object.fromEntries(req.headers.entries())
  });

  try {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Handle health check
    if (req.method === 'GET' && !req.headers.get('upgrade')) {
      return new Response(JSON.stringify({
        status: 'healthy',
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
        headers: corsHeaders 
      });
    }

    // Upgrade to WebSocket
    const { socket, response } = Deno.upgradeWebSocket(req);
    console.log(`[${connectionId}] New WebSocket connection attempt`);

    // Set up the connection state
    const state = connectionManager.addConnection(connectionId, clientId, socket);

    socket.onopen = () => {
      console.log(`[${connectionId}] WebSocket opened successfully`);
      connectionManager.setupPingInterval(connectionId, socket);
      
      socket.send(JSON.stringify({
        type: 'connected',
        connectionId,
        timestamp: Date.now()
      }));
    };

    socket.onmessage = (event) => {
      handleMessage(connectionId, event.data);
    };

    socket.onerror = (error) => {
      console.error(`[${connectionId}] WebSocket error:`, error);
      const state = connectionManager.getConnection(connectionId);
      if (state) {
        state.errors.push({
          timestamp: Date.now(),
          message: 'WebSocket error event'
        });
      }
    };

    socket.onclose = () => {
      console.log(`[${connectionId}] WebSocket closed`);
      connectionManager.removeConnection(connectionId);
    };

    return response;
  } catch (error) {
    console.error(`[${connectionId}] Error:`, error);
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