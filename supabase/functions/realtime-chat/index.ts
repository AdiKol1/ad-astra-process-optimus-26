import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const HEARTBEAT_INTERVAL = 30000; // 30 seconds
const HEARTBEAT_TIMEOUT = 35000; // 35 seconds

interface Connection {
  socket: WebSocket;
  lastHeartbeat: number;
  pingInterval?: number;
  sessionId: string;
}

const connections = new Map<string, Connection>();

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-session-id',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Max-Age': '86400'
};

// Heartbeat checker
setInterval(() => {
  const now = Date.now();
  for (const [sessionId, conn] of connections) {
    if (now - conn.lastHeartbeat > HEARTBEAT_TIMEOUT) {
      console.log(`[${sessionId}] Connection timed out - no heartbeat`);
      conn.socket.close(1000, 'Heartbeat timeout');
      connections.delete(sessionId);
    }
  }
}, HEARTBEAT_INTERVAL);

serve(async (req) => {
  const sessionId = req.headers.get('x-session-id') || crypto.randomUUID();
  
  console.log(`[${sessionId}] Request received:`, {
    method: req.method,
    url: new URL(req.url).pathname,
    upgrade: req.headers.get('upgrade'),
    sessionId
  });

  try {
    // CORS preflight
    if (req.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Health check endpoint
    if (req.method === 'GET' && !req.headers.get('upgrade')) {
      return new Response(JSON.stringify({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        activeConnections: connections.size
      }), {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }

    // Handle WebSocket upgrade
    if (req.headers.get('upgrade')?.toLowerCase() === 'websocket') {
      // Clean up any existing connection for this session
      if (connections.has(sessionId)) {
        console.log(`[${sessionId}] Cleaning up existing connection`);
        const existingConn = connections.get(sessionId)!;
        clearInterval(existingConn.pingInterval);
        existingConn.socket.close(1000, 'New connection requested');
        connections.delete(sessionId);
      }

      try {
        console.log(`[${sessionId}] Upgrading to WebSocket`);
        const { socket, response } = Deno.upgradeWebSocket(req);
        
        const connection: Connection = {
          socket,
          lastHeartbeat: Date.now(),
          sessionId
        };

        // Set up socket handlers
        socket.onopen = () => {
          console.log(`[${sessionId}] WebSocket opened`);
          
          // Start heartbeat
          connection.pingInterval = setInterval(() => {
            if (socket.readyState === WebSocket.OPEN) {
              socket.send(JSON.stringify({ type: 'ping', timestamp: Date.now() }));
            }
          }, HEARTBEAT_INTERVAL);

          // Send initial connection success message
          socket.send(JSON.stringify({
            type: 'connected',
            sessionId,
            timestamp: Date.now()
          }));
        };

        socket.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data);
            connection.lastHeartbeat = Date.now();

            // Handle different message types
            switch (message.type) {
              case 'pong':
                // Update heartbeat timestamp only
                break;
              case 'ping':
                socket.send(JSON.stringify({ type: 'pong', timestamp: Date.now() }));
                break;
              default:
                console.log(`[${sessionId}] Message received:`, message);
                // Echo back for testing
                socket.send(JSON.stringify({
                  type: 'echo',
                  data: message,
                  timestamp: Date.now()
                }));
            }
          } catch (err) {
            console.error(`[${sessionId}] Message handling error:`, err);
            socket.send(JSON.stringify({
              type: 'error',
              error: 'Invalid message format',
              timestamp: Date.now()
            }));
          }
        };

        socket.onerror = (event) => {
          console.error(`[${sessionId}] WebSocket error:`, event);
        };

        socket.onclose = (event) => {
          console.log(`[${sessionId}] WebSocket closed:`, {
            code: event.code,
            reason: event.reason,
            wasClean: event.wasClean
          });
          
          // Clean up connection
          if (connection.pingInterval) {
            clearInterval(connection.pingInterval);
          }
          connections.delete(sessionId);
        };

        // Store connection
        connections.set(sessionId, connection);

        // Add required headers
        response.headers.set('Upgrade', 'websocket');
        response.headers.set('Connection', 'Upgrade');
        Object.entries(corsHeaders).forEach(([key, value]) => {
          response.headers.set(key, value);
        });

        return response;

      } catch (err) {
        console.error(`[${sessionId}] WebSocket upgrade failed:`, err);
        return new Response('WebSocket upgrade failed', { 
          status: 426,
          headers: corsHeaders
        });
      }
    }

    return new Response('Expected WebSocket upgrade', { 
      status: 426,
      headers: corsHeaders
    });

  } catch (err) {
    console.error(`[${sessionId}] Error:`, err);
    return new Response(JSON.stringify({
      error: 'Internal server error',
      message: err instanceof Error ? err.message : String(err)
    }), {
      status: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  }
});