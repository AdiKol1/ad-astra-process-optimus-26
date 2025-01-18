import { useCallback, useRef, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase'; // Import supabase instance

export const useWebSocketConnection = () => {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<number | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const [isCleaningUp, setIsCleaningUp] = useState(false);
  const { toast } = useToast();
  const MAX_RECONNECT_ATTEMPTS = 5;
  const RECONNECT_DELAY = 3000;

  const cleanup = useCallback(() => {
    if (isCleaningUp) return;
    setIsCleaningUp(true);
    
    console.log('Cleaning up WebSocket connection');
    
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    if (wsRef.current) {
      wsRef.current.onclose = null; // Prevent triggering reconnect
      wsRef.current.close();
      wsRef.current = null;
    }

    setIsCleaningUp(false);
  }, [isCleaningUp]);

  const setupWebSocket = useCallback(async () => {
    if (isCleaningUp) return;
    cleanup();

    try {
      // Get auth token
      const session = await supabase.auth.getSession();
      const token = session?.data?.session?.access_token;

      if (!token) {
        throw new Error('No authentication token available');
      }

      const wsUrl = `wss://gjkagdysjgljjbnagoib.functions.supabase.co/functions/v1/realtime-chat`;
      console.log('Attempting to connect to:', wsUrl);
      
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      // Set up ping interval
      let pingInterval: number;

      ws.onopen = () => {
        console.log('WebSocket connection established successfully');
        // Send authentication message
        ws.send(JSON.stringify({
          type: 'auth',
          token
        }));
        
        reconnectAttemptsRef.current = 0;
        
        // Start ping-pong to keep connection alive
        pingInterval = window.setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({
              type: 'ping',
              timestamp: Date.now()
            }));
          }
        }, 30000); // Send ping every 30 seconds
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        toast({
          title: "Connection Error",
          description: "Failed to connect to chat service",
          variant: "destructive"
        });
      };

      ws.onclose = (event) => {
        console.log('WebSocket connection closed', event);
        clearInterval(pingInterval);
        
        if (!event.wasClean && reconnectAttemptsRef.current < MAX_RECONNECT_ATTEMPTS) {
          toast({
            title: "Connection Lost",
            description: "Attempting to reconnect...",
            variant: "destructive"
          });
          
          reconnectAttemptsRef.current++;
          reconnectTimeoutRef.current = window.setTimeout(() => {
            setupWebSocket();
          }, RECONNECT_DELAY);
        } else if (reconnectAttemptsRef.current >= MAX_RECONNECT_ATTEMPTS) {
          toast({
            title: "Connection Failed",
            description: "Maximum reconnection attempts reached. Please refresh the page.",
            variant: "destructive"
          });
        }
      };

    } catch (error) {
      console.error('Error setting up WebSocket:', error);
      toast({
        title: "Connection Error",
        description: "Failed to initialize chat service",
        variant: "destructive"
      });
    }
  }, [cleanup, toast, isCleaningUp]);

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

  return {
    wsRef,
    setupWebSocket,
    cleanup,
    sendMessage
  };
};
