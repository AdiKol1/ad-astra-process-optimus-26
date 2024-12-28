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
      // Use the correct URL format for the Supabase Edge Function
      const wsUrl = 'wss://gjkagdysjgljjbnagoib.functions.supabase.co/functions/v1/realtime-chat';
      console.log('Connecting to WebSocket URL:', wsUrl);
      
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('WebSocket connection established');
        setConnected(true);
        setReconnecting(false);
        reconnectAttemptsRef.current = 0;
        
        // Initialize session
        ws.send(JSON.stringify({
          type: 'session.initialize',
          timestamp: Date.now()
        }));
      };

      ws.onmessage = (event) => {
        console.log('Received message:', event.data);
        try {
          const data = JSON.parse(event.data);
          handleIncomingMessage(data);
        } catch (error) {
          console.error('Error parsing message:', error);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        toast({
          title: "Connection Error",
          description: "Failed to connect to chat service",
          variant: "destructive"
        });
      };

      ws.onclose = (event) => {
        console.log('WebSocket connection closed:', event);
        setConnected(false);
        
        if (!event.wasClean && reconnectAttemptsRef.current < MAX_RECONNECT_ATTEMPTS) {
          setReconnecting(true);
          reconnectAttemptsRef.current++;
          
          reconnectTimeoutRef.current = window.setTimeout(() => {
            console.log(`Attempting to reconnect... (${reconnectAttemptsRef.current}/${MAX_RECONNECT_ATTEMPTS})`);
            setupWebSocket();
          }, 3000);
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
        title: "Connection Error",
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