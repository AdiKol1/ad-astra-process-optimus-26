import { useState, useCallback, useRef, useEffect } from 'react';
import { useWebSocketState } from './chat/websocket/useWebSocketState';
import { useMessageHandler } from './chat/useMessageHandler';
import { useAudioHandling } from './chat/useAudioHandling';
import { useToast } from './use-toast';
import { logWebSocketEvent, measureLatency, getConnectionMetrics } from '@/utils/websocket/diagnostics';

export const useWebSocketChat = () => {
  const [isLoading, setIsLoading] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const { messages, handleIncomingMessage } = useMessageHandler();
  const { initializeAudio, startRecording, stopRecording } = useAudioHandling();
  const { toast } = useToast();
  const webSocketState = useWebSocketState();
  const { isConnected, isReconnecting, setConnected, setReconnecting } = webSocketState;
  const reconnectTimeoutRef = useRef<number | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const MAX_RECONNECT_ATTEMPTS = 5;
  const connectionStartTimeRef = useRef<number>(0);
  const requestIdRef = useRef<string>(crypto.randomUUID());

  const cleanup = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    if (wsRef.current) {
      wsRef.current.onclose = null; // Prevent triggering reconnect
      wsRef.current.close();
      wsRef.current = null;
    }
  }, []);

  const setupWebSocket = useCallback(() => {
    cleanup();

    try {
      console.log('Setting up WebSocket connection...');
      const wsUrl = 'wss://gjkagdysjgljjbnagoib.functions.supabase.co/functions/v1/realtime-chat';
      logWebSocketEvent('connection_attempt', { url: wsUrl }, requestIdRef.current);
      connectionStartTimeRef.current = Date.now();
      
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      const getLatency = measureLatency();

      ws.onopen = () => {
        const connectionTime = getLatency();
        logWebSocketEvent('connection_established', {
          connectionTime,
          metrics: getConnectionMetrics(ws)
        }, requestIdRef.current);
        
        setConnected(true);
        setReconnecting(false);
        reconnectAttemptsRef.current = 0;
        
        toast({
          title: "Connected",
          description: `WebSocket connection established in ${connectionTime}ms`,
        });
      };

      ws.onmessage = (event) => {
        logWebSocketEvent('message_received', {
          data: event.data,
          metrics: getConnectionMetrics(ws)
        }, requestIdRef.current);
        
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'error') {
            console.error('Server reported error:', data);
            toast({
              title: "Server Error",
              description: data.message || "An error occurred",
              variant: "destructive"
            });
          }
          handleIncomingMessage(data);
        } catch (error) {
          logWebSocketEvent('message_parse_error', { error }, requestIdRef.current);
          toast({
            title: "Error",
            description: "Failed to process message",
            variant: "destructive"
          });
        }
      };

      ws.onerror = (error) => {
        const connectionTime = Date.now() - connectionStartTimeRef.current;
        logWebSocketEvent('connection_error', {
          error,
          connectionTime,
          metrics: getConnectionMetrics(ws)
        }, requestIdRef.current);
        
        toast({
          title: "Connection Error",
          description: "Failed to connect to chat service. Retrying...",
          variant: "destructive"
        });
      };

      ws.onclose = (event) => {
        const connectionTime = Date.now() - connectionStartTimeRef.current;
        logWebSocketEvent('connection_closed', {
          code: event.code,
          reason: event.reason,
          wasClean: event.wasClean,
          connectionTime,
          metrics: getConnectionMetrics(ws)
        }, requestIdRef.current);
        
        setConnected(false);
        
        if (!event.wasClean && reconnectAttemptsRef.current < MAX_RECONNECT_ATTEMPTS) {
          setReconnecting(true);
          reconnectAttemptsRef.current++;
          
          const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 10000);
          logWebSocketEvent('reconnect_scheduled', {
            attempt: reconnectAttemptsRef.current,
            delay
          }, requestIdRef.current);
          
          reconnectTimeoutRef.current = window.setTimeout(() => {
            logWebSocketEvent('reconnect_attempt', {
              attempt: reconnectAttemptsRef.current,
              maxAttempts: MAX_RECONNECT_ATTEMPTS
            }, requestIdRef.current);
            setupWebSocket();
          }, delay);

          toast({
            title: "Connection Lost",
            description: `Reconnecting... Attempt ${reconnectAttemptsRef.current}/${MAX_RECONNECT_ATTEMPTS}`,
            variant: "destructive"
          });
        } else if (reconnectAttemptsRef.current >= MAX_RECONNECT_ATTEMPTS) {
          logWebSocketEvent('max_reconnect_attempts_reached', {
            attempts: reconnectAttemptsRef.current
          }, requestIdRef.current);
          
          toast({
            title: "Connection Failed",
            description: "Maximum reconnection attempts reached. Please refresh the page.",
            variant: "destructive"
          });
          setReconnecting(false);
        }
      };

    } catch (error) {
      logWebSocketEvent('setup_error', { error }, requestIdRef.current);
      toast({
        title: "Setup Error",
        description: "Failed to initialize chat service",
        variant: "destructive"
      });
    }
  }, [cleanup, setConnected, setReconnecting, handleIncomingMessage, toast]);

  useEffect(() => {
    logWebSocketEvent('initializing_chat', null, requestIdRef.current);
    initializeAudio();
    
    if (wsRef.current?.readyState !== WebSocket.OPEN) {
      setupWebSocket();
    }

    return cleanup;
  }, [setupWebSocket, cleanup, initializeAudio]);

  const sendMessage = useCallback((message: string) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      logWebSocketEvent('send_message_failed', {
        message,
        reason: 'WebSocket not ready'
      }, requestIdRef.current);
      return false;
    }

    try {
      logWebSocketEvent('sending_message', {
        message,
        metrics: getConnectionMetrics(wsRef.current)
      }, requestIdRef.current);
      
      wsRef.current.send(JSON.stringify({
        type: 'conversation.item.create',
        item: {
          type: 'message',
          role: 'user',
          content: [{ type: 'input_text', text: message }]
        }
      }));
      wsRef.current.send(JSON.stringify({ type: 'response.create' }));
      return true;
    } catch (error) {
      logWebSocketEvent('send_message_error', { error }, requestIdRef.current);
      return false;
    }
  }, []);

  return {
    messages,
    isConnected,
    isReconnecting,
    isLoading,
    startRecording,
    stopRecording,
    sendMessage
  };
};