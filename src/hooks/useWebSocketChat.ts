import { useEffect, useRef } from 'react';
import { useWebSocketState } from './chat/useWebSocketState';
import { useMessageHandler } from './chat/useMessageHandler';
import { useAudioHandling } from './chat/useAudioHandling';
import { useWebSocketConnection } from './chat/useWebSocketConnection';
import { useToast } from './use-toast';

export const useWebSocketChat = () => {
  const { messages, isLoading, setIsLoading, loadExistingMessages, handleIncomingMessage } = useMessageHandler();
  const { isConnected, isReconnecting } = useWebSocketState();
  const { initializeAudio, startRecording, stopRecording } = useAudioHandling();
  const { wsRef, setupWebSocket, cleanup, sendMessage } = useWebSocketConnection();
  const { toast } = useToast();
  const isMounted = useRef(true);

  useEffect(() => {
    const initializeChat = async () => {
      if (!isMounted.current) return;
      
      console.log('Initializing audio...');
      initializeAudio();
      
      console.log('Setting up WebSocket...');
      setupWebSocket();

      await loadExistingMessages();
    };

    initializeChat();

    return () => {
      isMounted.current = false;
      cleanup();
    };
  }, []);

  useEffect(() => {
    if (!wsRef.current) return;

    const ws = wsRef.current;
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        handleIncomingMessage(data);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    return () => {
      if (ws) {
        ws.onmessage = null;
      }
    };
  }, [wsRef, handleIncomingMessage]);

  const sendTextMessage = async (text: string) => {
    if (!text.trim()) return false;

    if (!isConnected) {
      toast({
        title: "Not Connected",
        description: "Please wait for the chat service to connect",
        variant: "destructive"
      });
      return false;
    }

    setIsLoading(true);
    console.log('Sending text message:', text);

    try {
      const success = sendMessage(JSON.stringify({
        type: 'conversation.item.create',
        item: {
          type: 'message',
          role: 'user',
          content: [{ type: 'input_text', text }]
        }
      }));

      if (success) {
        sendMessage(JSON.stringify({ type: 'response.create' }));
      }

      return success;
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    isConnected,
    isReconnecting,
    isLoading,
    startRecording,
    stopRecording,
    sendTextMessage
  };
};