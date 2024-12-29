export interface WebSocketState {
  isConnected: boolean;
  isReconnecting: boolean;
}

export interface WebSocketMessage {
  type: string;
  [key: string]: any;
}