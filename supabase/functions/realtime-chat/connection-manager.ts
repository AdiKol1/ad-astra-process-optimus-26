import { ConnectionState, WebSocketMessage } from './types.ts';
import { PING_INTERVAL, PONG_TIMEOUT } from './constants.ts';

class ConnectionManager {
  private connections = new Map<string, ConnectionState>();
  private clientConnections = new Map<string, Set<string>>();

  addConnection(connectionId: string, clientId: string, socket: WebSocket): ConnectionState {
    // Clean up any existing connection for this client
    this.removeClientConnections(clientId);

    const state: ConnectionState = {
      socket,
      lastPing: Date.now(),
      lastPong: Date.now(),
      messageCount: 0,
      errors: []
    };

    // Track connection by ID
    this.connections.set(connectionId, state);

    // Track client's connections
    if (!this.clientConnections.has(clientId)) {
      this.clientConnections.set(clientId, new Set());
    }
    this.clientConnections.get(clientId)!.add(connectionId);

    return state;
  }

  getConnection(connectionId: string): ConnectionState | undefined {
    return this.connections.get(connectionId);
  }

  removeConnection(connectionId: string) {
    const state = this.connections.get(connectionId);
    if (state) {
      if (state.pingInterval) {
        clearInterval(state.pingInterval);
      }
      this.connections.delete(connectionId);
    }
  }

  private removeClientConnections(clientId: string) {
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
    const state = this.connections.get(connectionId);
    if (state) {
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
          
          socket.send(JSON.stringify({
            type: 'ping',
            timestamp: now,
            connectionId
          }));
          state.lastPing = now;
        }
      }, PING_INTERVAL);
    }
  }

  cleanup() {
    const now = Date.now();
    for (const [id, state] of this.connections) {
      if (now - state.lastPong > PING_INTERVAL + PONG_TIMEOUT) {
        console.log(`[${id}] Connection stale - closing`);
        state.socket.close(1000, 'Connection stale');
        this.removeConnection(id);
      }
    }
  }
}

export const connectionManager = new ConnectionManager();