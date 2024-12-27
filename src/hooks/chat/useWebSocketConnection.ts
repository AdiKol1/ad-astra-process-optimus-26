import { useRef, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { SUPABASE_PUBLISHABLE_KEY } from '@/integrations/supabase/client';

export const useWebSocketConnection = () => {
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<number | null>(null);
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

      // Update WebSocket URL to use the correct format
      const wsUrl = `wss://gjkagdysjgljjbnagoib.supabase.co/realtime-chat`;
      console.log('Attempting to connect to:', wsUrl);
      
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('WebSocket connection established successfully');
        // Send authentication message immediately after connection
        ws.send(JSON.stringify({
          type: 'auth',
          token: SUPABASE_PUBLISHABLE_KEY
        }));
        setIsConnected(true);
        toast({
          title: "Connected",
          description: "Chat service is ready",
        });
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', {
          error,
          readyState: ws.readyState,
          url: ws.url
        });
        setIsConnected(false);
        toast({
          title: "Connection Error",
          description: "Failed to connect to chat service",
          variant: "destructive"
        });
      };

      ws.onclose = (event) => {
        console.log('WebSocket connection closed', {
          code: event.code,
          reason: event.reason,
          wasClean: event.wasClean
        });
        setIsConnected(false);
        
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
        }
        
        const backoffDelay = 3000; // Fixed 3-second delay for reconnection
        console.log(`Scheduling reconnection attempt in ${backoffDelay}ms`);
        reconnectTimeoutRef.current = window.setTimeout(() => {
          console.log('Attempting to reconnect...');
          setupWebSocket();
        }, backoffDelay);
      };

      return ws;
    } catch (error) {
      console.error('Error setting up WebSocket:', error);
      toast({
        title: "Connection Error",
        description: "Failed to initialize chat service",
        variant: "destructive"
      });
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