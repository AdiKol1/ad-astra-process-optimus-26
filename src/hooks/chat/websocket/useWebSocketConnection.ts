import { useCallback, useRef, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { logWebSocketEvent } from '@/utils/websocket/diagnostics';

export const useWebSocketConnection = () => {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<number | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const [isCleaningUp, setIsCleaningUp] = useState(false);
  const { toast } = useToast();
  const MAX_RECONNECT_ATTEMPTS = 5;
  const RECONNECT_DELAY = 3000;
  const requestIdRef = useRef<string>(crypto.randomUUID());

  const cleanup = useCallback(() => {
    if (isCleaningUp) return;
    setIsCleaningUp(true);
    
    logWebSocketEvent('cleanup_started', { requestId: requestIdRef.current });
    
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
    logWebSocketEvent('cleanup_completed', { requestId: requestIdRef.current });
  }, [isCleaningUp]);

  const setupWebSocket = useCallback(() => {
    if (isCleaningUp) return;
    cleanup();

    try {
      const wsUrl = `wss://gjkagdysjgljjbnagoib.functions.supabase.co/functions/v1/realtime-chat`;
      logWebSocketEvent('connection_attempt', { url: wsUrl, requestId: requestIdRef.current });
      
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      // Set up ping interval
      let pingInterval: number;

      ws.onopen = () => {
        logWebSocketEvent('connection_established', {
          requestId: requestIdRef.current,
          attempt: reconnectAttemptsRef.current
        });
        
        reconnectAttemptsRef.current = 0;
        
        // Start ping-pong to keep connection alive
        pingInterval = window.setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({
              type: 'ping',
              timestamp: Date.now(),
              requestId: requestIdRef.current
            }));
          }
        }, 30000);
      };

      ws.onerror = (error) => {
        logWebSocketEvent('connection_error', {
          error,
          requestId: requestIdRef.current
        });
        
        toast({
          title: "Connection Error",
          description: "Failed to connect to chat service. Retrying...",
          variant: "destructive"
        });
      };

      ws.onclose = (event) => {
        logWebSocketEvent('connection_closed', {
          event,
          requestId: requestIdRef.current
        });
        
        clearInterval(pingInterval);
        
        if (!event.wasClean && reconnectAttemptsRef.current < MAX_RECONNECT_ATTEMPTS) {
          toast({
            title: "Connection Lost",
            description: `Attempting to reconnect... (${reconnectAttemptsRef.current + 1}/${MAX_RECONNECT_ATTEMPTS})`,
            variant: "destructive"
          });
          
          reconnectAttemptsRef.current++;
          reconnectTimeoutRef.current = window.setTimeout(() => {
            setupWebSocket();
          }, RECONNECT_DELAY * Math.pow(2, reconnectAttemptsRef.current - 1));
        } else if (reconnectAttemptsRef.current >= MAX_RECONNECT_ATTEMPTS) {
          toast({
            title: "Connection Failed",
            description: "Maximum reconnection attempts reached. Please refresh the page.",
            variant: "destructive"
          });
        }
      };

    } catch (error) {
      logWebSocketEvent('setup_error', {
        error,
        requestId: requestIdRef.current
      });
      
      toast({
        title: "Connection Error",
        description: "Failed to initialize chat service",
        variant: "destructive"
      });
    }
  }, [cleanup, toast, isCleaningUp]);

  const sendMessage = useCallback((message: string) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      logWebSocketEvent('send_message_failed', {
        message,
        reason: 'WebSocket not ready',
        requestId: requestIdRef.current
      });
      return false;
    }

    try {
      logWebSocketEvent('sending_message', {
        message,
        requestId: requestIdRef.current
      });
      wsRef.current.send(message);
      return true;
    } catch (error) {
      logWebSocketEvent('send_message_error', {
        error,
        requestId: requestIdRef.current
      });
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
