import { useCallback, useRef, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { SUPABASE_PUBLISHABLE_KEY } from '@/integrations/supabase/client';

const WS_MAX_RECONNECT_ATTEMPTS = 3;
const WS_RECONNECT_BASE_DELAY = 1000;
const WS_RECONNECT_MAX_DELAY = 5000;

export const useWebSocketConnection = () => {
  const wsRef = useRef<WebSocket | null>(null);
  const pingIntervalRef = useRef<number | null>(null);
  const reconnectTimeoutRef = useRef<number | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const { setConnected, setReconnecting } = useWebSocketState();
  const { toast } = useToast();
  const [isCleaningUp, setIsCleaningUp] = useState(false);

  const cleanup = useCallback(() => {
    if (isCleaningUp) return;
    setIsCleaningUp(true);
    
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

    setConnected(false);
    setReconnecting(false);
    reconnectAttemptsRef.current = 0;
    setIsCleaningUp(false);
  }, [setConnected, setReconnecting, isCleaningUp]);

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
    if (isCleaningUp) return;
    cleanup();

    if (reconnectAttemptsRef.current >= WS_MAX_RECONNECT_ATTEMPTS) {
      console.log('Max reconnection attempts reached');
      setReconnecting(false);
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

      // Update the WebSocket URL to use the correct endpoint
      const wsUrl = `wss://gjkagdysjgljjbnagoib.supabase.co/realtime/v1/websocket?apikey=${encodeURIComponent(SUPABASE_PUBLISHABLE_KEY)}`;
      console.log('Attempting to connect to:', wsUrl);
      
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('WebSocket connection established successfully');
        setConnected(true);
        setReconnecting(false);
        reconnectAttemptsRef.current = 0;

        setupPingInterval(ws);

        // Send authentication message
        ws.send(JSON.stringify({
          type: 'auth',
          params: {
            headers: {
              apikey: SUPABASE_PUBLISHABLE_KEY,
              Authorization: `Bearer ${SUPABASE_PUBLISHABLE_KEY}`
            }
          }
        }));
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setConnected(false);
      };

      ws.onclose = (event) => {
        if (isCleaningUp) return;
        
        console.log('WebSocket connection closed', {
          code: event.code,
          reason: event.reason,
          wasClean: event.wasClean
        });
        
        setConnected(false);
        
        if (!event.wasClean && reconnectAttemptsRef.current < WS_MAX_RECONNECT_ATTEMPTS) {
          setReconnecting(true);
          reconnectAttemptsRef.current++;
          
          const delay = Math.min(
            WS_RECONNECT_MAX_DELAY,
            WS_RECONNECT_BASE_DELAY * Math.pow(2, reconnectAttemptsRef.current)
          );
          
          console.log(`Scheduling reconnection attempt ${reconnectAttemptsRef.current} in ${delay}ms`);
          
          reconnectTimeoutRef.current = window.setTimeout(() => {
            if (!isCleaningUp) {
              setupWebSocket();
            }
          }, delay);
        } else {
          setReconnecting(false);
        }
      };

    } catch (error) {
      console.error('Error setting up WebSocket:', error);
      setConnected(false);
      toast({
        title: "Connection Error",
        description: "Failed to initialize chat service",
        variant: "destructive"
      });
    }
  }, [cleanup, setupPingInterval, setConnected, setReconnecting, toast, isCleaningUp]);

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
    wsRef,
    setupWebSocket,
    cleanup,
    sendMessage
  };
};