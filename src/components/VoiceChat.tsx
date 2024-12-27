import React, { useRef, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { ChatMessage } from './chat/ChatMessage';
import { ChatInput } from './chat/ChatInput';
import { ChatHeader } from './chat/ChatHeader';
import { useWebSocketChat } from '@/hooks/useWebSocketChat';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './ui/use-toast';

export const VoiceChat = () => {
  const [isRecording, setIsRecording] = React.useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  const {
    messages,
    isConnected,
    startRecording,
    stopRecording,
    sendTextMessage
  } = useWebSocketChat();

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to use the chat feature",
          variant: "destructive"
        });
      }
    };
    
    checkAuth();
  }, [toast]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleStartRecording = async () => {
    const started = await startRecording();
    if (started) {
      setIsRecording(true);
    }
  };

  const handleStopRecording = () => {
    stopRecording();
    setIsRecording(false);
  };

  return (
    <Card className="fixed bottom-4 right-4 w-[400px] h-[600px] flex flex-col bg-white shadow-xl z-50">
      <ChatHeader isConnected={isConnected} />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <ChatMessage key={index} {...message} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <ChatInput
        onSendMessage={sendTextMessage}
        isRecording={isRecording}
        onStartRecording={handleStartRecording}
        onStopRecording={handleStopRecording}
        isConnected={isConnected}
      />
    </Card>
  );
};