import { useCallback, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { SUPABASE_PUBLISHABLE_KEY } from '@/integrations/supabase/client';
import {
  WS_RECONNECT_BASE_DELAY,
  WS_RECONNECT_MAX_DELAY,
  WS_PING_INTERVAL,
  WS_MAX_RECONNECT_ATTEMPTS
} from './constants';

export const useConnectionManager = () => {
  const wsRef = useRef<WebSocket | null>(null);
  const pingIntervalRef = useRef<number | null>(null);
  const reconnectTimeoutRef = useRef<number | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const { toast } = useToast();

  const cleanup = useCallback(() => {
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
      console.log('Closing existing WebSocket connection');
      wsRef.current.close();
      wsRef.current = null;
    }
  }, []);

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
    }, WS_PING_INTERVAL);
  }, []);

  const getReconnectDelay = useCallback(() => {
    const delay = Math.min(
      WS_RECONNECT_MAX_DELAY,
      WS_RECONNECT_BASE_DELAY * Math.pow(2, reconnectAttemptsRef.current)
    );
    return delay;
  }, []);

  return {
    wsRef,
    reconnectAttemptsRef,
    cleanup,
    setupPingInterval,
    getReconnectDelay,
    WS_MAX_RECONNECT_ATTEMPTS,
    toast
  };
};