import { useState, useCallback, useRef } from 'react';
import { useWebSocketState } from './websocket/useWebSocketState';
import { useMessageHandler } from './chat/useMessageHandler';
import { useAudioHandling } from './chat/useAudioHandling';
import { useWebSocketConnection } from './chat/useWebSocketConnection';
import { useToast } from '@/hooks/use-toast';

export const useWebSocketChat = () => {
  const { messages, isLoading, setIsLoading, loadExistingMessages, handleIncomingMessage } = useMessageHandler();
  const webSocketState = useWebSocketState();
  const { isConnected, isReconnecting } = webSocketState;
  const { initializeAudio, startRecording, stopRecording } = useAudioHandling();
  const { wsRef, setupWebSocket, cleanup, sendMessage } = useWebSocketConnection();
  const { toast } = useToast();
  const isMounted = useRef(true);

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