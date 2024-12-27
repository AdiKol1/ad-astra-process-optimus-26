import { useCallback } from 'react';
import { WebSocketMessage } from './types';

export const useMessageHandler = () => {
  const handleIncomingMessage = useCallback((data: WebSocketMessage) => {
    console.log('WebSocket message received:', data);
    
    if (data.type === 'error') {
      console.error('WebSocket error message:', data);
      return false;
    } else if (data.type === 'pong') {
      console.log('Received pong response');
      return true;
    }
    return true;
  }, []);

  return { handleIncomingMessage };
};