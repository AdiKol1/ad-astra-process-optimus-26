import { useWebSocketConnection } from './websocket/useWebSocketConnection';
import type { WebSocketMessage } from './websocket/types';

interface WebSocketOptions {
  onMessage?: (message: WebSocketMessage) => void;
  debug?: boolean;
  maxReconnectAttempts?: number;
  initialBackoffDelay?: number;
  maxBackoffDelay?: number;
}

export function useStableWebSocket(
  projectId: string,
  options: WebSocketOptions = {}
) {
  const {
    onMessage,
    debug = false,
    maxReconnectAttempts = 5,
    initialBackoffDelay = 1000,
    maxBackoffDelay = 30000
  } = options;

  const wsUrl = `wss://${projectId}.functions.supabase.co/realtime-chat`;

  const connection = useWebSocketConnection({
    url: wsUrl,
    debug,
    maxReconnectAttempts,
    initialBackoffDelay,
    maxBackoffDelay,
    pingInterval: 30000
  });

  return {
    ...connection,
    sendMessage: connection.sendMessage
  };
}