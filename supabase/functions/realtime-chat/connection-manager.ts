import { ConnectionState, WebSocketMessage } from './types.ts';
import { PING_INTERVAL, PONG_TIMEOUT, MAX_CONNECTIONS_PER_CLIENT } from './constants.ts';

class ConnectionManager {
  private connections = new Map<string, ConnectionState>();
  private clientConnections = new Map<string, Set<string>>();
  private lastCleanup = Date.now();

  addConnection(connectionId: string, clientId: string, socket: WebSocket): ConnectionState {
    console.log(`[${connectionId}] Adding new connection for client ${clientId}`);
    
    // Clean up any existing connection for this client
    this.removeClientConnections(clientId);

    const state: ConnectionState = {
      socket,
      lastPing: Date.now(),
      lastPong: Date.now(),
      messageCount: 0,
      errors: [],
      clientId
    };

    // Track connection by ID
    this.connections.set(connectionId, state);

    // Track client's connections
    if (!this.clientConnections.has(clientId)) {
      this.clientConnections.set(clientId, new Set());
    }
    this.clientConnections.get(clientId)!.add(connectionId);

    console.log(`[${connectionId}] Connection added successfully. Active connections: ${this.connections.size}`);
    return state;
  }

  getConnection(connectionId: string): ConnectionState | undefined {
    return this.connections.get(connectionId);
  }

  removeConnection(connectionId: string) {
    console.log(`[${connectionId}] Removing connection`);
    const state = this.connections.get(connectionId);
    if (state) {
      if (state.pingInterval) {
        clearInterval(state.pingInterval);
      }
      this.connections.delete(connectionId);
      
      // Remove from client connections tracking
      if (state.clientId) {
        const clientConns = this.clientConnections.get(state.clientId);
        if (clientConns) {
          clientConns.delete(connectionId);
          if (clientConns.size === 0) {
            this.clientConnections.delete(state.clientId);
          }
        }
      }
      
      console.log(`[${connectionId}] Connection removed. Remaining connections: ${this.connections.size}`);
    }
  }

  private removeClientConnections(clientId: string) {
    console.log(`Removing all connections for client ${clientId}`);
    const clientConns = this.clientConnections.get(clientId);
    if (clientConns) {
      for (const connId of clientConns) {
        const conn = this.connections.get(connId);
        if (conn) {
          if (conn.pingInterval) {
            clearInterval(conn.pingInterval);
          }
          conn.socket.close(1000, 'New connection from same client');
          this.connections.delete(connId);
        }
      }
      this.clientConnections.delete(clientId);
    }
  }

  setupPingInterval(connectionId: string, socket: WebSocket) {
    console.log(`[${connectionId}] Setting up ping interval`);
    const state = this.connections.get(connectionId);
    if (state) {
      // Clear any existing interval
      if (state.pingInterval) {
        clearInterval(state.pingInterval);
      }

      state.pingInterval = setInterval(() => {
        if (socket.readyState === WebSocket.OPEN) {
          const now = Date.now();
          
          // Check if we haven't received a pong in too long
          if (now - state.lastPong > PING_INTERVAL + PONG_TIMEOUT) {
            console.log(`[${connectionId}] No pong received - closing connection`);
            socket.close(1000, 'No pong received');
            this.removeConnection(connectionId);
            return;
          }
          
          try {
            socket.send(JSON.stringify({
              type: 'ping',
              timestamp: now,
              connectionId
            }));
            state.lastPing = now;
            console.log(`[${connectionId}] Ping sent successfully`);
          } catch (error) {
            console.error(`[${connectionId}] Error sending ping:`, error);
            this.removeConnection(connectionId);
          }
        }
      }, PING_INTERVAL);
    }
  }

  cleanup() {
    const now = Date.now();
    
    // Only run cleanup every 30 seconds
    if (now - this.lastCleanup < 30000) {
      return;
    }
    
    console.log('Running connection cleanup');
    this.lastCleanup = now;
    
    let closedCount = 0;
    for (const [id, state] of this.connections) {
      if (now - state.lastPong > PING_INTERVAL + PONG_TIMEOUT) {
        console.log(`[${id}] Connection stale - closing`);
        state.socket.close(1000, 'Connection stale');
        this.removeConnection(id);
        closedCount++;
      }
    }
    
    if (closedCount > 0) {
      console.log(`Cleanup complete. Closed ${closedCount} stale connections`);
    }
  }
}

export const connectionManager = new ConnectionManager();