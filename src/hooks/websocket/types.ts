export interface WebSocketState {
  status: 'disconnected' | 'connecting' | 'connected' | 'error';
  error: string | null;
}

export interface WebSocketMessage {
  type: string;
  content?: string;
  timestamp?: number;
  sessionId?: string;
  [key: string]: any;
}

export interface ConnectionConfig {
  url: string;
  debug?: boolean;
  maxReconnectAttempts?: number;
  initialBackoffDelay?: number;
  maxBackoffDelay?: number;
  pingInterval?: number;
}