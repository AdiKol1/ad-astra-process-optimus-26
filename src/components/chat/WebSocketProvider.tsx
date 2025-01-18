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
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      console.log('WebSocket already connected');
      return;
    }

    cleanup();

    try {
      const wsUrl = import.meta.env.VITE_WEBSOCKET_URL || 'wss://gjkagdysjgljjbnagoib.functions.supabase.co/realtime-chat';
      
      // Check if WebSocket is supported
      if (!window.WebSocket) {
        console.error('WebSocket not supported by browser');
        return;
      }

      console.log('Attempting to connect to:', wsUrl);
      logWebSocketEvent('connection_attempt', { 
        url: wsUrl,
        sessionId: sessionIdRef.current,
        attempt: reconnectAttemptsRef.current 
      });
      
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      // Set a connection timeout
      const connectionTimeout = setTimeout(() => {
        if (ws.readyState !== WebSocket.OPEN) {
          console.log('WebSocket connection timeout');
          ws.close();
        }
      }, 5000);

      ws.onopen = () => {
        clearTimeout(connectionTimeout);
        console.log('WebSocket connection established successfully');
        setIsConnected(true);
        setIsReconnecting(false);
        reconnectAttemptsRef.current = 0;
        
        const pingInterval = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            try {
              ws.send(JSON.stringify({
                type: 'ping',
                timestamp: Date.now(),
                sessionId: sessionIdRef.current
              }));
            } catch (err) {
              console.error('Error sending ping:', err);
              clearInterval(pingInterval);
              ws.close();
            }
          } else {
            clearInterval(pingInterval);
          }
        }, 30000);

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
        clearTimeout(connectionTimeout);
        console.error('WebSocket error:', error);
        setIsConnected(false);
        logWebSocketEvent('connection_error', { 
          sessionId: sessionIdRef.current,
          error: error.toString() 
        });
        
        // Close the connection on error to trigger reconnect
        ws.close();
      };

      ws.onclose = (event) => {
        clearTimeout(connectionTimeout);
        console.log('WebSocket connection closed', event);
        setIsConnected(false);
        
        // Only attempt to reconnect if we haven't exceeded max attempts
        if (reconnectAttemptsRef.current < MAX_RECONNECT_ATTEMPTS) {
          const delay = Math.min(
            INITIAL_RECONNECT_DELAY * Math.pow(2, reconnectAttemptsRef.current),
            MAX_RECONNECT_DELAY
          );
          
          console.log(`Attempting to reconnect in ${delay}ms`);
          setIsReconnecting(true);
          reconnectTimeoutRef.current = window.setTimeout(() => {
            reconnectAttemptsRef.current++;
            setupWebSocket();
          }, delay);
        } else {
          setIsReconnecting(false);
          toast({
            title: 'Connection Error',
            description: 'Unable to establish real-time connection. Some features may be limited.',
            variant: 'destructive',
          });
        }
      };
    } catch (error) {
      console.error('Error setting up WebSocket:', error);
      setIsConnected(false);
      setIsReconnecting(false);
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

  // Initialize WebSocket connection
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