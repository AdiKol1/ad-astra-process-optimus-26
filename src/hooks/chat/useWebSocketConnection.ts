import { useState, useRef, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { SUPABASE_PUBLISHABLE_KEY } from '@/integrations/supabase/client';

export const useWebSocketConnection = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [hasShownInitialToast, setHasShownInitialToast] = useState(false);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<number | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const messageQueueRef = useRef<string[]>([]);
  const { toast } = useToast();

  const cleanup = useCallback(() => {
    console.log('Cleaning up WebSocket connection');
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    if (wsRef.current) {
      console.log('Closing existing WebSocket connection');
      wsRef.current.close();
      wsRef.current = null;
    }
    setIsConnected(false);
  }, []);

  const processMessageQueue = useCallback(() => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;

    while (messageQueueRef.current.length > 0) {
      const message = messageQueueRef.current.shift();
      if (message) {
        try {
          wsRef.current.send(message);
          console.log('Processed queued message:', message);
        } catch (error) {
          console.error('Error sending queued message:', error);
          messageQueueRef.current.unshift(message); // Put message back at start of queue
          break;
        }
      }
    }
  }, []);

  const setupWebSocket = useCallback(() => {
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
        setIsReconnecting(false);
        reconnectAttemptsRef.current = 0;

        // Process any queued messages
        processMessageQueue();

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
          
          if (data.type === 'error') {
            console.error('WebSocket error message:', data);
            toast({
              title: "Chat Error",
              description: data.message || "An error occurred",
              variant: "destructive"
            });
          } else if (data.type === 'pong') {
            console.log('Received pong response');
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
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

      ws.onclose = (event) => {
        console.log('WebSocket connection closed', {
          code: event.code,
          reason: event.reason,
          wasClean: event.wasClean
        });
        setIsConnected(false);
        
        // Don't attempt to reconnect if the connection was closed cleanly
        if (event.wasClean) {
          return;
        }
        
        setIsReconnecting(true);
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

        if (reconnectAttemptsRef.current > 1) {
          toast({
            title: "Connection Lost",
            description: "Attempting to reconnect...",
            variant: "destructive"
          });
        }
      };

      // Set up ping interval to keep connection alive
      const pingInterval = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ type: 'ping' }));
        }
      }, 30000);

      // Clean up ping interval on unmount
      return () => {
        clearInterval(pingInterval);
        cleanup();
      };

    } catch (error) {
      console.error('Error setting up WebSocket:', error);
      setIsConnected(false);
      toast({
        title: "Connection Error",
        description: "Failed to initialize chat service",
        variant: "destructive"
      });
      return null;
    }
  }, [cleanup, processMessageQueue, hasShownInitialToast, toast]);

  const sendMessage = useCallback((message: string) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      messageQueueRef.current.push(message);
      console.log('Message queued:', message);
      return false;
    }

    try {
      wsRef.current.send(message);
      console.log('Message sent:', message);
      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      messageQueueRef.current.push(message);
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
