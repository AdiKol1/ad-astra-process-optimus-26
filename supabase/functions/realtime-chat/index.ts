import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const HEARTBEAT_INTERVAL = 30000;
const HEARTBEAT_TIMEOUT = 35000;

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
  'Access-Control-Max-Age': '86400',
  'Upgrade': 'websocket',
  'Connection': 'Upgrade'
};

// Heartbeat checker
const heartbeatChecker = setInterval(() => {
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
    url: req.url,
    upgrade: req.headers.get('upgrade'),
    sessionId
  });

  try {
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
      if (connections.has(sessionId)) {
        console.log(`[${sessionId}] Cleaning up existing connection`);
        const existingConn = connections.get(sessionId)!;
        clearInterval(existingConn.pingInterval);
        existingConn.socket.close(1000, 'New connection requested');
        connections.delete(sessionId);
      }

      const { socket, response } = Deno.upgradeWebSocket(req, {
        protocol: 'chat',
        idleTimeout: HEARTBEAT_TIMEOUT
      });
      
      const connection: Connection = {
        socket,
        lastHeartbeat: Date.now(),
        sessionId
      };

      socket.onopen = () => {
        console.log(`[${sessionId}] WebSocket opened`);
        
        connection.pingInterval = setInterval(() => {
          if (socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({ type: 'ping', timestamp: Date.now() }));
          }
        }, HEARTBEAT_INTERVAL);

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

          switch (message.type) {
            case 'pong':
              break;
            case 'ping':
              socket.send(JSON.stringify({ type: 'pong', timestamp: Date.now() }));
              break;
            default:
              console.log(`[${sessionId}] Message received:`, message);
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
        
        if (connection.pingInterval) {
          clearInterval(connection.pingInterval);
        }
        connections.delete(sessionId);
      };

      connections.set(sessionId, connection);

      // Create response with headers already set
      const upgradeResponse = new Response(null, {
        status: 101,
        headers: corsHeaders
      });

      return upgradeResponse;
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