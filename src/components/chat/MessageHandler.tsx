import React, { useState, useCallback } from 'react';
import { useWebSocket } from './WebSocketProvider';
import { useToast } from '@/hooks/use-toast';
import { Message } from '@/types/chat';

interface MessageHandlerProps {
  onMessageReceived: (message: Message) => void;
}

export const MessageHandler: React.FC<MessageHandlerProps> = ({ onMessageReceived }) => {
  const { isConnected, sendMessage } = useWebSocket();
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleSendMessage = useCallback(async (content: string) => {
    if (!content.trim() || !isConnected || isProcessing) return false;

    setIsProcessing(true);
    try {
      const success = sendMessage(JSON.stringify({
        type: 'message',
        content,
        timestamp: Date.now()
      }));

      if (success) {
        onMessageReceived({
          content,
          isBot: false
        });
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
      setIsProcessing(false);
    }
  }, [isConnected, sendMessage, onMessageReceived, toast, isProcessing]);

  return null;
};