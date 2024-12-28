export interface ConnectionState {
  socket: WebSocket;
  lastPing: number;
  lastPong: number;
  messageCount: number;
  pingInterval?: number;
  errors: Array<{ timestamp: number; message: string }>;
  clientId: string;
}

export interface WebSocketMessage {
  type: string;
  timestamp?: number;
  connectionId?: string;
  [key: string]: any;
}