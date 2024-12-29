import { WebSocketMessage } from './types.ts';
import { connectionManager } from './connection-manager.ts';

export function handleMessage(connectionId: string, data: string) {
  const state = connectionManager.getConnection(connectionId);
  if (!state) return;

  try {
    const message: WebSocketMessage = JSON.parse(data);
    state.messageCount++;

    switch (message.type) {
      case 'pong':
        state.lastPong = Date.now();
        break;
        
      case 'ping':
        state.socket.send(JSON.stringify({
          type: 'pong',
          timestamp: Date.now(),
          connectionId
        }));
        state.lastPong = Date.now();
        break;
        
      default:
        console.log(`[${connectionId}] Message received:`, message);
        state.socket.send(JSON.stringify({
          type: 'echo',
          data: message,
          timestamp: Date.now(),
          connectionId
        }));
    }
  } catch (error) {
    console.error(`[${connectionId}] Message processing error:`, error);
    state.errors.push({
      timestamp: Date.now(),
      message: error instanceof Error ? error.message : String(error)
    });
    
    state.socket.send(JSON.stringify({
      type: 'error',
      error: 'Failed to process message',
      timestamp: Date.now(),
      connectionId
    }));
  }
}