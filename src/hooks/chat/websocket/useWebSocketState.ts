import { useState } from 'react';
import type { WebSocketState } from './types';

export const useWebSocketState = () => {
  const [state, setState] = useState<WebSocketState>({
    isConnected: false,
    isReconnecting: false
  });

  const setConnected = (connected: boolean) => {
    setState(prev => ({ ...prev, isConnected: connected }));
  };

  const setReconnecting = (reconnecting: boolean) => {
    setState(prev => ({ ...prev, isReconnecting: reconnecting }));
  };

  return {
    ...state,
    setConnected,
    setReconnecting
  };
};