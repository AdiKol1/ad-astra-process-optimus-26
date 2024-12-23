import { useRef, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { Message } from '@/types/chat';

export const useWebSocketConnection = () => {
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<number | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const { toast } = useToast();

  const setupWebSocket = () => {
    console.log('Setting up WebSocket connection...');
    
    const ws = new WebSocket(`wss://gjkagdysjgljjbnagoib.functions.supabase.co/functions/v1/realtime-chat`);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('Connected to chat server');
      setIsConnected(true);
      reconnectAttemptsRef.current = 0;
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
        description: "Failed to connect to chat service. Retrying...",
        variant: "destructive"
      });
    };

    ws.onclose = () => {
      console.log('WebSocket closed');
      setIsConnected(false);
      
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      
      const backoffDelay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 30000);
      reconnectAttemptsRef.current++;
      
      reconnectTimeoutRef.current = setTimeout(() => {
        if (!wsRef.current || wsRef.current.readyState === WebSocket.CLOSED) {
          setupWebSocket();
        }
      }, backoffDelay);
    };

    return ws;
  };

  const cleanup = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    wsRef.current?.close();
  };

  return {
    isConnected,
    wsRef,
    setupWebSocket,
    cleanup
  };
};