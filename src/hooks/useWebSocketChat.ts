import { useEffect, useRef, useState } from 'react';
import { useWebSocketState } from './chat/websocket/useWebSocketState';
import { useMessageHandler } from './chat/useMessageHandler';
import { useAudioHandling } from './chat/useAudioHandling';
import { useWebSocketConnection } from './chat/useWebSocketConnection';
import { useToast } from './use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Message } from '@/types/chat';

export const useWebSocketChat = () => {
  const { messages, isLoading, setIsLoading, loadExistingMessages, handleIncomingMessage } = useMessageHandler();
  const webSocketState = useWebSocketState();
  const { isConnected, isReconnecting } = webSocketState;
  const { initializeAudio, startRecording, stopRecording } = useAudioHandling();
  const { wsRef, setupWebSocket, cleanup, sendMessage } = useWebSocketConnection();
  const { toast } = useToast();
  const isMounted = useRef(true);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  // Set up realtime subscription for chat messages
  useEffect(() => {
    console.log('Setting up realtime subscription for chat messages');
    
    const channel = supabase
      .channel('chat_messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages'
        },
        (payload) => {
          console.log('Received new message:', payload);
          if (payload.new) {
            const newMessage: Message = {
              content: payload.new.content,
              isBot: !payload.new.is_user
            };
            handleIncomingMessage(newMessage);
          }
        }
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      console.log('Cleaning up realtime subscription');
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [handleIncomingMessage]);

  // Initialize audio and load existing messages
  useEffect(() => {
    const initializeChat = async () => {
      if (!isMounted.current) return;
      
      console.log('Initializing audio...');
      initializeAudio();
      
      console.log('Loading existing messages...');
      await loadExistingMessages();
      
      // Only set up WebSocket for voice chat
      if (wsRef.current?.readyState !== WebSocket.OPEN) {
        console.log('Setting up WebSocket for voice chat...');
        setupWebSocket();
      }
    };

    initializeChat();

    return () => {
      isMounted.current = false;
      cleanup();
    };
  }, []);

  const sendTextMessage = async (text: string) => {
    if (!text.trim()) return false;

    setIsLoading(true);
    console.log('Sending text message:', text);

    try {
      const { error } = await supabase
        .from('chat_messages')
        .insert([
          {
            content: text,
            is_user: true
          }
        ]);

      if (error) {
        console.error('Error sending message:', error);
        toast({
          title: "Error",
          description: "Failed to send message",
          variant: "destructive"
        });
        return false;
      }

      // Trigger AI response through WebSocket for processing
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

      return true;
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