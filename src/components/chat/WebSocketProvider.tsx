import React, { createContext, useContext, useCallback, useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { logWebSocketEvent } from '@/utils/websocket/diagnostics';

interface WebSocketContextType {
  isConnected: boolean;
  isReconnecting: boolean;
  sendMessage: (message: string) => boolean;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<number | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const [isConnected, setIsConnected] = React.useState(false);
  const [isReconnecting, setIsReconnecting] = React.useState(false);
  const { toast } = useToast();
  const requestIdRef = useRef<string>(crypto.randomUUID());
  const MAX_RECONNECT_ATTEMPTS = 5;

  const cleanup = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  }, []);

  const setupWebSocket = useCallback(() => {
    cleanup();

    try {
      console.log('Setting up WebSocket connection...');
      const wsUrl = `wss://gjkagdysjgljjbnagoib.functions.supabase.co/realtime-chat`;
      logWebSocketEvent('connection_attempt', { url: wsUrl }, requestIdRef.current);
      
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('WebSocket connection established');
        setIsConnected(true);
        setIsReconnecting(false);
        reconnectAttemptsRef.current = 0;
      };

      ws.onclose = () => {
        console.log('WebSocket connection closed');
        setIsConnected(false);
        
        if (reconnectAttemptsRef.current < MAX_RECONNECT_ATTEMPTS) {
          setIsReconnecting(true);
          reconnectAttemptsRef.current++;
          
          const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 10000);
          reconnectTimeoutRef.current = window.setTimeout(setupWebSocket, delay);
          
          toast({
            title: "Connection Lost",
            description: "Attempting to reconnect...",
            variant: "destructive"
          });
        } else {
          setIsReconnecting(false);
          toast({
            title: "Connection Failed",
            description: "Maximum reconnection attempts reached",
            variant: "destructive"
          });
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setIsConnected(false);
      };

    } catch (error) {
      console.error('Error setting up WebSocket:', error);
      setIsConnected(false);
      setIsReconnecting(false);
    }
  }, [cleanup, toast]);

  const sendMessage = useCallback((message: string) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      toast({
        title: "Not Connected",
        description: "Please wait for the chat service to connect",
        variant: "destructive"
      });
      return false;
    }

    try {
      wsRef.current.send(message);
      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      return false;
    }
  }, [toast]);

  useEffect(() => {
    setupWebSocket();
    return cleanup;
  }, [setupWebSocket, cleanup]);

  return (
    <WebSocketContext.Provider value={{ isConnected, isReconnecting, sendMessage }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};