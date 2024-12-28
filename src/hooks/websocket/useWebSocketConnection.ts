import { useState, useEffect, useCallback } from 'react';
import { WebSocketState, ConnectionConfig } from './types';
import { ConnectionManager } from './connectionManager';
import { useToast } from '@/hooks/use-toast';

export function useWebSocketConnection(config: ConnectionConfig) {
  const [state, setState] = useState<WebSocketState>({
    status: 'disconnected',
    error: null
  });
  const [manager, setManager] = useState<ConnectionManager | null>(null);
  const { toast } = useToast();

  const handleMessage = useCallback((data: any) => {
    console.log('Message received:', data);
  }, []);

  useEffect(() => {
    const connectionManager = new ConnectionManager(
      config,
      (newState) => {
        setState(newState);
        if (newState.error) {
          toast({
            title: "Connection Error",
            description: newState.error,
            variant: "destructive"
          });
        }
      },
      handleMessage
    );

    setManager(connectionManager);
    connectionManager.connect();

    return () => {
      connectionManager.disconnect();
    };
  }, [config, handleMessage, toast]);

  const sendMessage = useCallback((message: any) => {
    return manager?.send(message) ?? false;
  }, [manager]);

  return {
    ...state,
    sendMessage
  };
}