import { useRef, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const useWebSocketConnection = () => {
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<number | null>(null);
  const { toast } = useToast();

  const setupWebSocket = async () => {
    console.log('Setting up WebSocket connection...');
    
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      console.log('WebSocket already connected');
      return wsRef.current;
    }

    // Get the current session
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      console.error('No active session');
      toast({
        title: "Authentication Required",
        description: "Please sign in to use the chat feature",
        variant: "destructive"
      });
      return null;
    }

    const ws = new WebSocket(
      `wss://gjkagdysjgljjbnagoib.functions.supabase.co/functions/v1/realtime-chat?jwt=${session.access_token}`
    );
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('WebSocket connection established');
      setIsConnected(true);
      toast({
        title: "Connected",
        description: "Chat service is ready",
      });
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsConnected(false);
      toast({
        title: "Connection Error",
        description: "Failed to connect to chat service",
        variant: "destructive"
      });
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
      setIsConnected(false);
      
      // Clear any existing reconnection timeout
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      
      // Attempt to reconnect after 2 seconds
      reconnectTimeoutRef.current = window.setTimeout(() => {
        console.log('Attempting to reconnect...');
        setupWebSocket();
      }, 2000);
    };

    return ws;
  };

  const cleanup = () => {
    console.log('Cleaning up WebSocket connection');
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  };

  return {
    isConnected,
    wsRef,
    setupWebSocket,
    cleanup
  };
};