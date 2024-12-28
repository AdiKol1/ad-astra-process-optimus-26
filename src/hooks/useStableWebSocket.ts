import { useState, useEffect, useCallback, useRef } from 'react';
import { WebSocketState, ConnectionConfig } from './websocket/types';
import { useToast } from '@/hooks/use-toast';

const INITIAL_RETRY_DELAY = 1000;
const MAX_RETRY_DELAY = 30000;

export function useStableWebSocket(config: ConnectionConfig) {
  const [state, setState] = useState<WebSocketState>({
    status: 'disconnected',
    error: null
  });
  
  const wsRef = useRef<WebSocket | null>(null);
  const retryTimeoutRef = useRef<number | null>(null);
  const retryAttemptRef = useRef(0);
  const { toast } = useToast();

  const cleanup = useCallback(() => {
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  }, []);

  const connect = useCallback(() => {
    cleanup();
    
    try {
      console.log('Attempting WebSocket connection...');
      setState({ status: 'connecting', error: null });
      
      const ws = new WebSocket(config.url);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('WebSocket connected successfully');
        setState({ status: 'connected', error: null });
        retryAttemptRef.current = 0;
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'ping') {
            ws.send(JSON.stringify({ type: 'pong', timestamp: Date.now() }));
          } else if (config.onMessage) {
            config.onMessage(data);
          }
        } catch (error) {
          console.error('Error processing message:', error);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setState({ 
          status: 'error', 
          error: 'Connection error occurred' 
        });
      };

      ws.onclose = () => {
        console.log('WebSocket closed');
        setState({ status: 'disconnected', error: null });
        scheduleReconnect();
      };

    } catch (error) {
      console.error('Error setting up WebSocket:', error);
      setState({ 
        status: 'error', 
        error: 'Failed to setup connection' 
      });
      scheduleReconnect();
    }
  }, [config, cleanup]);

  const scheduleReconnect = useCallback(() => {
    if (retryTimeoutRef.current) return;

    const delay = Math.min(
      INITIAL_RETRY_DELAY * Math.pow(2, retryAttemptRef.current),
      MAX_RETRY_DELAY
    );

    console.log(`Scheduling reconnection attempt in ${delay}ms`);
    retryTimeoutRef.current = window.setTimeout(() => {
      retryTimeoutRef.current = null;
      retryAttemptRef.current++;
      connect();
    }, delay);
  }, [connect]);

  const send = useCallback((message: any): boolean => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      console.log('WebSocket not ready, message not sent:', message);
      return false;
    }

    try {
      wsRef.current.send(JSON.stringify(message));
      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      return false;
    }
  }, []);

  useEffect(() => {
    connect();
    return cleanup;
  }, [connect, cleanup]);

  return {
    ...state,
    send
  };
}