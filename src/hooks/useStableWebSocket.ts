import { useState, useEffect, useRef, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { logWebSocketEvent } from '@/utils/websocket/diagnostics';

interface WebSocketState {
  status: 'disconnected' | 'connecting' | 'connected' | 'error';
  error: string | null;
}

interface WebSocketOptions {
  onMessage?: (message: any) => void;
  debug?: boolean;
  maxReconnectAttempts?: number;
  initialBackoffDelay?: number;
  maxBackoffDelay?: number;
}

export function useStableWebSocket(
  projectId: string, 
  options: WebSocketOptions = {}
) {
  const {
    onMessage,
    debug = false,
    maxReconnectAttempts = 5,
    initialBackoffDelay = 1000,
    maxBackoffDelay = 30000
  } = options;

  const [state, setState] = useState<WebSocketState>({
    status: 'disconnected',
    error: null
  });

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<number>();
  const reconnectAttemptsRef = useRef(0);
  const { toast } = useToast();
  const sessionIdRef = useRef<string>(crypto.randomUUID());

  const log = useCallback((...args: any[]) => {
    if (debug) {
      console.log('[WebSocket]', ...args);
    }
  }, [debug]);

  const cleanup = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = undefined;
    }
  }, []);

  const connect = useCallback(() => {
    cleanup();
    setState({ status: 'connecting', error: null });

    try {
      const wsUrl = `wss://${projectId}.functions.supabase.co/realtime-chat`;
      log('Connecting to:', wsUrl);
      logWebSocketEvent('connection_attempt', { 
        url: wsUrl,
        sessionId: sessionIdRef.current,
        attempt: reconnectAttemptsRef.current 
      });

      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        log('Connected');
        setState({
          status: 'connected',
          error: null
        });
        reconnectAttemptsRef.current = 0;

        // Send initial ping
        ws.send(JSON.stringify({
          type: 'ping',
          timestamp: Date.now(),
          sessionId: sessionIdRef.current
        }));

        // Set up ping interval
        const pingInterval = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({
              type: 'ping',
              timestamp: Date.now(),
              sessionId: sessionIdRef.current
            }));
          } else {
            clearInterval(pingInterval);
          }
        }, 30000);

        // Clean up interval on close
        ws.addEventListener('close', () => clearInterval(pingInterval));
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          log('Message received:', message);
          onMessage?.(message);
        } catch (err) {
          log('Message parsing error:', err);
        }
      };

      ws.onclose = (event) => {
        log('Connection closed:', event);
        setState(prev => ({
          status: 'disconnected',
          error: event.wasClean ? null : `Connection closed (${event.code})`
        }));

        if (reconnectAttemptsRef.current < maxReconnectAttempts) {
          reconnectAttemptsRef.current++;
          const delay = Math.min(
            initialBackoffDelay * Math.pow(2, reconnectAttemptsRef.current),
            maxBackoffDelay
          );
          
          log(`Attempting to reconnect in ${delay}ms (attempt ${reconnectAttemptsRef.current})`);
          reconnectTimeoutRef.current = window.setTimeout(connect, delay);
          
          if (reconnectAttemptsRef.current > 1) {
            toast({
              title: "Connection Lost",
              description: "Attempting to reconnect...",
              variant: "destructive"
            });
          }
        } else {
          toast({
            title: "Connection Failed",
            description: "Maximum reconnection attempts reached. Please refresh the page.",
            variant: "destructive"
          });
        }
      };

      ws.onerror = (error) => {
        log('WebSocket error:', error);
        logWebSocketEvent('connection_error', { 
          sessionId: sessionIdRef.current,
          error: error.toString() 
        });
        setState({
          status: 'error',
          error: 'Connection error occurred'
        });
      };

    } catch (err) {
      log('Setup error:', err);
      setState({
        status: 'error',
        error: err instanceof Error ? err.message : 'Failed to setup connection'
      });
    }
  }, [
    projectId,
    onMessage,
    cleanup,
    debug,
    log,
    toast,
    maxReconnectAttempts,
    initialBackoffDelay,
    maxBackoffDelay
  ]);

  useEffect(() => {
    connect();
    return cleanup;
  }, [connect, cleanup]);

  return {
    ...state,
    sendMessage: useCallback((message: any) => {
      if (wsRef.current?.readyState !== WebSocket.OPEN) {
        setState(prev => ({
          ...prev,
          error: 'Not connected'
        }));
        return false;
      }

      try {
        wsRef.current.send(JSON.stringify(message));
        return true;
      } catch (err) {
        console.error('Send error:', err);
        setState(prev => ({
          ...prev,
          error: 'Failed to send message'
        }));
        return false;
      }
    }, [])
  };
}