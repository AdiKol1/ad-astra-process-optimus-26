export type WebSocketMessage = {
  type: string;
  [key: string]: any;
};

export type WebSocketState = {
  isConnected: boolean;
  isReconnecting: boolean;
};