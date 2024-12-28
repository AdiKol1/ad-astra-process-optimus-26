import { useState, useEffect, useRef, useCallback } from 'react';

interface WebSocketState {
  status: 'disconnected' | 'connecting' | 'connected' | 'error';
  error: string | null;
}

interface WebSocketOptions {
  onMessage?: (message: any) => void;
  debug?: boolean;
}

export function useStableWebSocket(projectId: string, options: WebSocketOptions = {}) {
  const { onMessage, debug = false } = options;
  const [state, setState] = useState<WebSocketState>({
    status: 'disconnected',
    error: null
  });

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<number>();

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

    try {
      const wsUrl = `wss://${projectId}.functions.supabase.co/realtime-chat`;
      log('Connecting to:', wsUrl);

      const ws = new WebSocket(wsUrl, 'chat');
      wsRef.current = ws;

      ws.onopen = () => {
        log('Connected');
        setState({
          status: 'connected',
          error: null
        });
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
      };

      ws.onerror = (event) => {
        log('WebSocket error:', event);
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
  }, [projectId, onMessage, debug, log, cleanup]);

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