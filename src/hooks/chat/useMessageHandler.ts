import { useState, useCallback } from 'react';
import { Message } from '@/types/chat';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useMessageHandler = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const loadExistingMessages = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;

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

  const handleIncomingMessage = useCallback((data: any) => {
    try {
      if (data.type === 'response.audio.delta') {
        // Handle audio data
      } else if (data.type === 'response.audio_transcript.delta') {
        setMessages(prev => {
          const lastMessage = prev[prev.length - 1];
          if (lastMessage && lastMessage.isBot) {
            return [
              ...prev.slice(0, -1),
              { ...lastMessage, content: lastMessage.content + data.delta }
            ];
          }
          return [...prev, { content: data.delta, isBot: true }];
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
  }, [toast]);

  return {
    messages,
    isLoading,
    setIsLoading,
    loadExistingMessages,
    handleIncomingMessage
  };
};