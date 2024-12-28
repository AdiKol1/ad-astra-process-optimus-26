import React, { createContext, useContext, useState, useCallback } from 'react';
import { Message } from '@/types/chat';
import { useWebSocket } from '@/components/chat/WebSocketProvider';
import { useToast } from '@/hooks/use-toast';

interface ChatContextType {
  messages: Message[];
  isLoading: boolean;
  sendMessage: (content: string) => Promise<boolean>;
  clearMessages: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { isConnected, sendMessage: wssSendMessage } = useWebSocket();
  const { toast } = useToast();

  const sendMessage = useCallback(async (content: string): Promise<boolean> => {
    if (!isConnected) {
      toast({
        title: "Connection Error",
        description: "Please wait for the chat service to connect",
        variant: "destructive"
      });
      return false;
    }

    setIsLoading(true);
    try {
      const success = wssSendMessage(content);
      if (success) {
        setMessages(prev => [...prev, { content, isBot: false }]);
      }
      return success;
    } catch (error) {
      console.error('Error sending message:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [isConnected, wssSendMessage, toast]);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return (
    <ChatContext.Provider value={{ messages, isLoading, sendMessage, clearMessages }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};