import { useCallback, useRef, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useWebSocketState } from './websocket/useWebSocketState';
import { useSessionManager } from './websocket/useSessionManager';
import { useEventHandlers } from './websocket/useEventHandlers';
import { usePingInterval } from './websocket/usePingInterval';
import {
  WS_RECONNECT_BASE_DELAY,
  WS_RECONNECT_MAX_DELAY,
  WS_MAX_RECONNECT_ATTEMPTS
} from './websocket/constants';

export const useWebSocketConnection = () => {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<number | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const { setConnected, setReconnecting } = useWebSocketState();
  const { toast } = useToast();
  const [isCleaningUp, setIsCleaningUp] = useState(false);
  const [status, setStatus] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const { initializeSession } = useSessionManager();
  const { setupPingInterval, cleanup: cleanupPingInterval } = usePingInterval();
  
  const cleanup = useCallback(() => {
    if (isCleaningUp) return;
    setIsCleaningUp(true);
    
    console.log('Cleaning up WebSocket connection');
    
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    cleanupPingInterval();
    
    if (wsRef.current) {
      wsRef.current.onclose = null;
      wsRef.current.close();
      wsRef.current = null;
    }

    setConnected(false);
    setReconnecting(false);
    reconnectAttemptsRef.current = 0;
    setIsCleaningUp(false);
  }, [setConnected, setReconnecting, isCleaningUp, cleanupPingInterval]);

  const { handleOpen, handleError, handleClose } = useEventHandlers(
    wsRef,
    setConnected,
    setReconnecting,
    setupPingInterval,
    initializeSession
  );

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
      const wsUrl = `wss://gjkagdysjgljjbnagoib.functions.supabase.co/realtime-chat?apikey=${SUPABASE_PUBLISHABLE_KEY}`;
      console.log('Attempting to connect to:', wsUrl);
      
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => handleOpen(ws);
      ws.onerror = handleError;
      ws.onclose = handleClose;

    } catch (error) {
      console.error('Error setting up WebSocket:', error);
      setConnected(false);
      toast({
        title: "Connection Error",
        description: "Failed to initialize chat service",
        variant: "destructive"
      });
    }
  }, [cleanup, handleOpen, handleError, handleClose, setConnected, toast, isCleaningUp]);

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
    sendMessage,
    status,
    error
  };
};