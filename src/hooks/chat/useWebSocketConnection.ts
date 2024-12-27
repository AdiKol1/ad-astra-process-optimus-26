import { useState, useCallback, useRef } from 'react';
import { SUPABASE_PUBLISHABLE_KEY } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const WS_MAX_RECONNECT_ATTEMPTS = 3;
const WS_RECONNECT_BASE_DELAY = 1000;
const WS_RECONNECT_MAX_DELAY = 5000;

export const useWebSocketConnection = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimeoutRef = useRef<number | null>(null);
  const pingIntervalRef = useRef<number | null>(null);
  const { toast } = useToast();

  const cleanup = useCallback(() => {
    console.log('Cleaning up WebSocket connection');
    
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    if (pingIntervalRef.current) {
      clearInterval(pingIntervalRef.current);
      pingIntervalRef.current = null;
    }
    
    if (wsRef.current) {
      wsRef.current.onclose = null; // Remove the onclose handler to prevent reconnection
      wsRef.current.close();
      wsRef.current = null;
    }

    setIsConnected(false);
    setIsReconnecting(false);
    reconnectAttemptsRef.current = 0;
  }, []);

  const setupPingInterval = useCallback((ws: WebSocket) => {
    if (pingIntervalRef.current) {
      clearInterval(pingIntervalRef.current);
    }
    
    pingIntervalRef.current = window.setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'ping' }));
      } else {
        clearInterval(pingIntervalRef.current!);
      }
    }, 30000);
  }, []);

  const setupWebSocket = useCallback(() => {
    cleanup();

    if (reconnectAttemptsRef.current >= WS_MAX_RECONNECT_ATTEMPTS) {
      console.log('Max reconnection attempts reached');
      setIsReconnecting(false);
      toast({
        title: "Connection Failed",
        description: "Unable to establish connection after multiple attempts",
        variant: "destructive"
      });
      return;
    }

    try {
      if (!SUPABASE_PUBLISHABLE_KEY) {
        throw new Error('Supabase anon key is not configured');
      }

      const wsUrl = `wss://gjkagdysjgljjbnagoib.supabase.co/realtime/v1/websocket?apikey=${encodeURIComponent(SUPABASE_PUBLISHABLE_KEY)}`;
      console.log('Attempting to connect to:', wsUrl);
      
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('WebSocket connection established successfully');
        setIsConnected(true);
        setIsReconnecting(false);
        reconnectAttemptsRef.current = 0;

        setupPingInterval(ws);

        ws.send(JSON.stringify({
          type: 'auth',
          token: SUPABASE_PUBLISHABLE_KEY
        }));
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setIsConnected(false);
      };

      ws.onclose = (event) => {
        console.log('WebSocket connection closed', {
          code: event.code,
          reason: event.reason,
          wasClean: event.wasClean
        });
        
        setIsConnected(false);
        
        // Only attempt to reconnect if we haven't reached the maximum attempts
        // and the closure wasn't clean (i.e., not intentional)
        if (!event.wasClean && reconnectAttemptsRef.current < WS_MAX_RECONNECT_ATTEMPTS) {
          setIsReconnecting(true);
          reconnectAttemptsRef.current++;
          
          const delay = Math.min(
            WS_RECONNECT_MAX_DELAY,
            WS_RECONNECT_BASE_DELAY * Math.pow(2, reconnectAttemptsRef.current)
          );
          
          console.log(`Scheduling reconnection attempt ${reconnectAttemptsRef.current} in ${delay}ms`);
          
          reconnectTimeoutRef.current = window.setTimeout(() => {
            if (!isConnected) {
              setupWebSocket();
            }
          }, delay);
        } else {
          setIsReconnecting(false);
        }
      };

    } catch (error) {
      console.error('Error setting up WebSocket:', error);
      setIsConnected(false);
      toast({
        title: "Connection Error",
        description: "Failed to initialize chat service",
        variant: "destructive"
      });
    }
  }, [cleanup, setupPingInterval, isConnected, toast]);

  const sendMessage = useCallback((message: string) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      console.log('WebSocket not ready, message not sent:', message);
      return false;
    }

    try {
      wsRef.current.send(message);
      console.log('Message sent:', message);
      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      return false;
    }
  }, []);

  return {
    isConnected,
    isReconnecting,
    wsRef,
    setupWebSocket,
    cleanup,
    sendMessage
  };
};