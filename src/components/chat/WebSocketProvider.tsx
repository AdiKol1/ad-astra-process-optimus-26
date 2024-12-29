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
  const sessionIdRef = useRef<string>(crypto.randomUUID());
  const MAX_RECONNECT_ATTEMPTS = 5;
  const INITIAL_RECONNECT_DELAY = 2000;
  const MAX_RECONNECT_DELAY = 30000;

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
      // Use secure WebSocket URL
      const wsUrl = `wss://gjkagdysjgljjbnagoib.functions.supabase.co/realtime-chat`;
      console.log('Attempting to connect to:', wsUrl);
      logWebSocketEvent('connection_attempt', { 
        url: wsUrl,
        sessionId: sessionIdRef.current,
        attempt: reconnectAttemptsRef.current 
      });
      
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('WebSocket connection established successfully');
        setIsConnected(true);
        setIsReconnecting(false);
        reconnectAttemptsRef.current = 0;
        
        // Send initial ping with session ID
        ws.send(JSON.stringify({
          type: 'ping',
          timestamp: Date.now(),
          sessionId: sessionIdRef.current
        }));

        // Set up ping interval
        const pingInterval = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({
              type: 'ping',
              timestamp: Date.now(),
              sessionId: sessionIdRef.current
            }));
          } else {
            clearInterval(pingInterval);
          }
        }, 30000);

        // Clean up interval on close
        ws.addEventListener('close', () => clearInterval(pingInterval));
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('WebSocket message received:', data);
          
          if (data.type === 'pong') {
            console.log('Received pong response');
          }
        } catch (error) {
          console.error('Error processing message:', error);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setIsConnected(false);
        logWebSocketEvent('connection_error', { 
          sessionId: sessionIdRef.current,
          error: error.toString() 
        });
      };

      ws.onclose = (event) => {
        console.log('WebSocket connection closed', event);
        setIsConnected(false);
        
        // Disable automatic reconnection
        setIsReconnecting(false);
        cleanup();
      };

    } catch (error) {
      console.error('Error setting up WebSocket:', error);
      setIsConnected(false);
      setIsReconnecting(false);
      toast({
        title: "Connection Error",
        description: "Failed to initialize chat service",
        variant: "destructive"
      });
    }
  }, [cleanup, toast]);

  const sendMessage = useCallback((message: string) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      console.log('WebSocket not ready, message not sent:', message);
      return false;
    }

    try {
      console.log('Sending message:', message);
      wsRef.current.send(message);
      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      return false;
    }
  }, []);

  // Remove the automatic connection on mount
  // useEffect(() => {
  //   setupWebSocket();
  //   return cleanup;
  // }, [setupWebSocket, cleanup]);

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