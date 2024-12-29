import { useState, useCallback, useRef, useEffect } from 'react';
import { useToast } from './use-toast';
import { logWebSocketEvent } from '@/utils/websocket/diagnostics';

export const useWebSocketChat = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [messages, setMessages] = useState<Array<{content: string; isBot: boolean}>>([]);
  const wsRef = useRef<WebSocket | null>(null);
  const { toast } = useToast();
  const reconnectTimeoutRef = useRef<number | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const MAX_RECONNECT_ATTEMPTS = 5;
  const requestIdRef = useRef<string>(crypto.randomUUID());

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
      const wsUrl = `wss://gjkagdysjgljjbnagoib.functions.supabase.co/functions/v1/realtime-chat`;
      logWebSocketEvent('connection_attempt', { url: wsUrl }, requestIdRef.current);
      
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('WebSocket connection established');
        setIsConnected(true);
        setIsReconnecting(false);
        reconnectAttemptsRef.current = 0;
        
        // Send initial ping
        ws.send(JSON.stringify({
          type: 'ping',
          timestamp: Date.now(),
          requestId: requestIdRef.current
        }));
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('WebSocket message received:', data);
          
          if (data.type === 'message.echo') {
            setMessages(prev => [...prev, { content: data.data.content, isBot: false }]);
          }
        } catch (error) {
          console.error('Error processing message:', error);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setIsConnected(false);
        toast({
          title: "Connection Error",
          description: "Error connecting to chat service",
          variant: "destructive"
        });
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

    } catch (error) {
      console.error('Error setting up WebSocket:', error);
      setIsConnected(false);
      setIsReconnecting(false);
      toast({
        title: "Setup Error",
        description: "Failed to initialize chat service",
        variant: "destructive"
      });
    }
  }, [cleanup, toast]);

  useEffect(() => {
    setupWebSocket();
    return cleanup;
  }, [setupWebSocket, cleanup]);

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
      wsRef.current.send(JSON.stringify({
        type: 'message',
        content: message,
        timestamp: Date.now(),
        requestId: requestIdRef.current
      }));
      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      return false;
    }
  }, [toast]);

  return {
    messages,
    isConnected,
    isReconnecting,
    isLoading,
    sendMessage
  };
};