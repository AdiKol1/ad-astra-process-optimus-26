import { useState, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { SUPABASE_PUBLISHABLE_KEY } from '@/integrations/supabase/client';

export const useWebSocketConnection = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [hasShownInitialToast, setHasShownInitialToast] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<number | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const { toast } = useToast();

  const cleanup = () => {
    console.log('Cleaning up WebSocket connection');
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    if (wsRef.current) {
      console.log('Closing existing WebSocket connection');
      wsRef.current.close();
      wsRef.current = null;
    }
  };

  const setupWebSocket = () => {
    cleanup();

    console.log('Setting up new WebSocket connection...');
    
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
        reconnectAttemptsRef.current = 0;

        // Only show toast on initial connection
        if (!hasShownInitialToast) {
          toast({
            title: "Connected",
            description: "Chat service is ready",
          });
          setHasShownInitialToast(true);
        }

        // Send authentication message immediately after connection
        ws.send(JSON.stringify({
          type: 'auth',
          token: SUPABASE_PUBLISHABLE_KEY
        }));
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('WebSocket message received:', data);
          
          // Handle different message types
          switch (data.type) {
            case 'auth':
              console.log('Authentication response:', data);
              break;
            case 'error':
              console.error('WebSocket error message:', data);
              toast({
                title: "Chat Error",
                description: data.message || "An error occurred",
                variant: "destructive"
              });
              break;
            default:
              console.log('Unhandled message type:', data.type);
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', {
          error,
          readyState: ws.readyState,
          url: ws.url
        });
        setIsConnected(false);
      };

      ws.onclose = (event) => {
        console.log('WebSocket connection closed', {
          code: event.code,
          reason: event.reason,
          wasClean: event.wasClean,
          attempts: reconnectAttemptsRef.current
        });
        setIsConnected(false);
        
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
        }
        
        // Implement exponential backoff with a maximum delay
        const maxDelay = 30000; // 30 seconds
        const baseDelay = 1000; // 1 second
        const backoffDelay = Math.min(
          maxDelay,
          baseDelay * Math.pow(2, reconnectAttemptsRef.current)
        );
        
        reconnectAttemptsRef.current++;
        
        console.log(`Scheduling reconnection attempt in ${backoffDelay}ms`);
        reconnectTimeoutRef.current = window.setTimeout(() => {
          console.log('Attempting to reconnect...');
          setupWebSocket();
        }, backoffDelay);
      };

      return ws;
    } catch (error) {
      console.error('Error setting up WebSocket:', error);
      setIsConnected(false);
      return null;
    }
  };

  return {
    isConnected,
    wsRef,
    setupWebSocket,
    cleanup
  };
};