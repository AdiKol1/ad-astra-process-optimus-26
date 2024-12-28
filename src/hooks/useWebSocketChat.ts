import { useState, useCallback, useRef, useEffect } from 'react';
import { useWebSocketState } from './chat/websocket/useWebSocketState';
import { useMessageHandler } from './chat/useMessageHandler';
import { useAudioHandling } from './chat/useAudioHandling';
import { useToast } from './use-toast';

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
      console.log('Connecting to WebSocket URL:', wsUrl);
      connectionStartTimeRef.current = Date.now();
      
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('WebSocket connection established');
        const connectionTime = Date.now() - connectionStartTimeRef.current;
        console.log(`Connection established in ${connectionTime}ms`);
        
        setConnected(true);
        setReconnecting(false);
        reconnectAttemptsRef.current = 0;
        
        // Initialize session
        ws.send(JSON.stringify({
          type: 'session.initialize',
          timestamp: Date.now(),
          diagnostics: {
            connectionTime,
            userAgent: navigator.userAgent,
            platform: navigator.platform
          }
        }));

        toast({
          title: "Connected",
          description: "Successfully connected to chat service",
        });
      };

      ws.onmessage = (event) => {
        console.log('Received message:', event.data);
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
          console.error('Error parsing message:', error);
          toast({
            title: "Error",
            description: "Failed to process message",
            variant: "destructive"
          });
        }
      };

      ws.onerror = (error) => {
        const connectionTime = Date.now() - connectionStartTimeRef.current;
        console.error('WebSocket error:', error, `(after ${connectionTime}ms)`);
        toast({
          title: "Connection Error",
          description: "Failed to connect to chat service. Retrying...",
          variant: "destructive"
        });
      };

      ws.onclose = (event) => {
        const connectionTime = Date.now() - connectionStartTimeRef.current;
        console.log('WebSocket connection closed', {
          code: event.code,
          reason: event.reason,
          wasClean: event.wasClean,
          connectionDuration: connectionTime
        });
        setConnected(false);
        
        if (!event.wasClean && reconnectAttemptsRef.current < MAX_RECONNECT_ATTEMPTS) {
          setReconnecting(true);
          reconnectAttemptsRef.current++;
          
          reconnectTimeoutRef.current = window.setTimeout(() => {
            console.log(`Attempting to reconnect... (${reconnectAttemptsRef.current}/${MAX_RECONNECT_ATTEMPTS})`);
            setupWebSocket();
          }, Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 10000)); // Exponential backoff

          toast({
            title: "Connection Lost",
            description: `Reconnecting... Attempt ${reconnectAttemptsRef.current}/${MAX_RECONNECT_ATTEMPTS}`,
            variant: "destructive"
          });
        } else if (reconnectAttemptsRef.current >= MAX_RECONNECT_ATTEMPTS) {
          toast({
            title: "Connection Failed",
            description: "Maximum reconnection attempts reached. Please refresh the page.",
            variant: "destructive"
          });
          setReconnecting(false);
        }
      };

    } catch (error) {
      console.error('Error setting up WebSocket:', error);
      toast({
        title: "Setup Error",
        description: "Failed to initialize chat service",
        variant: "destructive"
      });
    }
  }, [cleanup, setConnected, setReconnecting, handleIncomingMessage, toast]);

  useEffect(() => {
    console.log('Initializing chat...');
    initializeAudio();
    
    if (wsRef.current?.readyState !== WebSocket.OPEN) {
      setupWebSocket();
    }

    return cleanup;
  }, [setupWebSocket, cleanup, initializeAudio]);

  const sendMessage = useCallback((message: string) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      console.log('WebSocket not ready, message not sent:', message);
      return false;
    }

    try {
      console.log('Sending message:', message);
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
      console.error('Error sending message:', error);
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