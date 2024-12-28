import { useState, useEffect, useRef, useCallback } from 'react';

interface WebSocketState {
  status: 'disconnected' | 'connecting' | 'connected' | 'error';
  error: string | null;
  sessionId: string | null;
}

interface WebSocketOptions {
  onMessage?: (message: any) => void;
  maxReconnectAttempts?: number;
  debug?: boolean;
}

const INITIAL_RETRY_DELAY = 1000;
const MAX_RETRY_DELAY = 30000;

export function useStableWebSocket(projectId: string, options: WebSocketOptions = {}) {
  const {
    onMessage,
    maxReconnectAttempts = 5,
    debug = false
  } = options;

  const [state, setState] = useState<WebSocketState>({
    status: 'disconnected',
    error: null,
    sessionId: null
  });

  const wsRef = useRef<WebSocket | null>(null);
  const sessionIdRef = useRef<string>(crypto.randomUUID());
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimeoutRef = useRef<number>();
  const heartbeatTimeoutRef = useRef<number>();
  const lastHeartbeatRef = useRef<number>(Date.now());

  const log = useCallback((...args: any[]) => {
    if (debug) {
      console.log('[WebSocket]', ...args);
    }
  }, [debug]);

  const cleanup = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.close(1000, 'Cleanup');
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    if (heartbeatTimeoutRef.current) {
      clearTimeout(heartbeatTimeoutRef.current);
    }
  }, []);

  const connect = useCallback(() => {
    cleanup();
    
    if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
      log('Max reconnection attempts reached');
      setState({
        status: 'error',
        error: 'Max reconnection attempts reached',
        sessionId: sessionIdRef.current
      });
      return;
    }

    setState(prev => ({ ...prev, status: 'connecting', error: null }));

    try {
      const wsUrl = `wss://${projectId}.functions.supabase.co/realtime-chat`;
      log('Connecting to:', wsUrl);

      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        log('Connected');
        reconnectAttemptsRef.current = 0;
        setState({
          status: 'connected',
          error: null,
          sessionId: sessionIdRef.current
        });

        // Start heartbeat check
        lastHeartbeatRef.current = Date.now();
        heartbeatTimeoutRef.current = window.setInterval(() => {
          const now = Date.now();
          if (now - lastHeartbeatRef.current > 35000) {
            log('Heartbeat timeout');
            cleanup();
            reconnect();
          } else if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: 'ping', timestamp: now }));
          }
        }, 30000);
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          lastHeartbeatRef.current = Date.now();

          if (message.type === 'ping') {
            ws.send(JSON.stringify({ type: 'pong', timestamp: Date.now() }));
            return;
          }

          if (message.type === 'pong') {
            return;
          }

          log('Message received:', message);
          onMessage?.(message);
        } catch (err) {
          log('Message parsing error:', err);
        }
      };

      ws.onclose = (event) => {
        log('Connection closed:', event);
        cleanup();

        setState(prev => ({
          ...prev,
          status: 'disconnected',
          error: event.wasClean ? null : `Connection closed (${event.code})`
        }));

        if (!event.wasClean) {
          reconnect();
        }
      };

      ws.onerror = (event) => {
        log('WebSocket error:', event);
        setState(prev => ({
          ...prev,
          status: 'error',
          error: 'Connection error occurred'
        }));
      };

    } catch (err) {
      log('Setup error:', err);
      setState({
        status: 'error',
        error: err instanceof Error ? err.message : 'Failed to setup connection',
        sessionId: sessionIdRef.current
      });
      reconnect();
    }
  }, [projectId, maxReconnectAttempts, onMessage, debug, log, cleanup]);

  const reconnect = useCallback(() => {
    const attempt = reconnectAttemptsRef.current + 1;
    if (attempt <= maxReconnectAttempts) {
      reconnectAttemptsRef.current = attempt;
      const delay = Math.min(INITIAL_RETRY_DELAY * Math.pow(2, attempt - 1), MAX_RETRY_DELAY);
      
      log(`Scheduling reconnection attempt ${attempt}/${maxReconnectAttempts} in ${delay}ms`);
      reconnectTimeoutRef.current = window.setTimeout(connect, delay);
    }
  }, [maxReconnectAttempts, connect, log]);

  const sendMessage = useCallback((message: any) => {
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
  }, []);

  useEffect(() => {
    connect();
    return cleanup;
  }, [connect, cleanup]);

  return {
    ...state,
    sendMessage,
    reconnect: connect
  };
}