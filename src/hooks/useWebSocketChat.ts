import { useEffect, useState, useCallback } from 'react';
import { useAudioHandling } from './chat/useAudioHandling';
import { useWebSocketConnection } from './chat/useWebSocketConnection';
import { useToast } from '@/hooks/use-toast';
import type { Message } from '@/types/chat';
import { supabase } from '@/integrations/supabase/client';

export const useWebSocketChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { isConnected, isReconnecting, wsRef, setupWebSocket, cleanup, sendMessage } = useWebSocketConnection();
  const { initializeAudio, startRecording, stopRecording, handleAudioData } = useAudioHandling();
  const { toast } = useToast();

  // Load existing messages from Supabase
  const loadExistingMessages = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        throw error;
      }

      if (data) {
        setMessages(data.map(msg => ({
          content: msg.content,
          isBot: !msg.is_user
        })));
      }
    } catch (error) {
      console.error('Error loading messages:', error);
      toast({
        title: "Error",
        description: "Failed to load chat history",
        variant: "destructive"
      });
    }
  }, [toast]);

  // Initialize chat only once when component mounts
  useEffect(() => {
    let isMounted = true;

    const initializeChat = async () => {
      if (!isMounted) return;
      
      console.log('Initializing audio...');
      initializeAudio();
      
      console.log('Setting up WebSocket...');
      setupWebSocket();

      // Load existing messages
      await loadExistingMessages();
    };

    initializeChat();

    // Cleanup function
    return () => {
      isMounted = false;
      cleanup();
    };
  }, []); // Empty dependency array to run only once

  const saveMessageToSupabase = async (content: string, isUser: boolean) => {
    try {
      const { error } = await supabase
        .from('chat_messages')
        .insert([
          {
            content,
            is_user: isUser,
          }
        ]);

      if (error) throw error;
    } catch (error) {
      console.error('Error saving message:', error);
      toast({
        title: "Error",
        description: "Failed to save message",
        variant: "destructive"
      });
    }
  };

  const handleIncomingMessage = useCallback((data: any) => {
    try {
      console.log('Processing incoming message:', data);
      
      if (data.type === 'response.audio.delta') {
        handleAudioData(data.delta);
      } else if (data.type === 'response.audio_transcript.delta') {
        setMessages(prev => {
          const lastMessage = prev[prev.length - 1];
          if (lastMessage && lastMessage.isBot) {
            const updatedMessage = {
              ...lastMessage,
              content: lastMessage.content + data.delta
            };
            // Save the updated bot message
            saveMessageToSupabase(updatedMessage.content, false);
            return [...prev.slice(0, -1), updatedMessage];
          }
          const newMessage = { content: data.delta, isBot: true };
          // Save the new bot message
          saveMessageToSupabase(newMessage.content, false);
          return [...prev, newMessage];
        });
      }
    } catch (error) {
      console.error('Error processing message:', error);
      toast({
        title: "Error",
        description: "Failed to process message",
        variant: "destructive"
      });
    }
  }, [handleAudioData, toast]);

  // Set up WebSocket message handler
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

    // Optimistically add message to UI
    const userMessage = { content: text, isBot: false };
    setMessages(prev => [...prev, userMessage]);

    // Save user message to Supabase
    await saveMessageToSupabase(text, true);

    try {
      // Send message through WebSocket
      sendMessage(JSON.stringify({
        type: 'conversation.item.create',
        item: {
          type: 'message',
          role: 'user',
          content: [{ type: 'input_text', text }]
        }
      }));

      sendMessage(JSON.stringify({ type: 'response.create' }));
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