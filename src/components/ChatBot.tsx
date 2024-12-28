import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, X, Send, Mic, MicOff, Loader2 } from 'lucide-react';
import { useChat } from '@/contexts/ChatContext';
import { useToast } from '@/hooks/use-toast';
import { useStableWebSocket } from '@/hooks/useStableWebSocket';

const ChatMessages = () => {
  const { messages } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <ScrollArea className="flex-1 p-4 bg-gray-50">
      <div className="space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl p-4 ${
                message.isBot
                  ? 'bg-gray-200 text-gray-900'
                  : 'bg-gold text-space'
              }`}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
};

const ChatInput = () => {
  const [input, setInput] = useState('');
  const { sendMessage, isLoading } = useChat();
  const [isRecording, setIsRecording] = useState(false);
  const { toast } = useToast();
  const { status, error } = useStableWebSocket('gjkagdysjgljjbnagoib', {
    debug: true,
    onMessage: (message) => {
      console.log('Received message:', message);
    }
  });

  useEffect(() => {
    if (error) {
      toast({
        title: "Connection Error",
        description: error,
        variant: "destructive"
      });
    }
  }, [error, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    if (status !== 'connected') {
      toast({
        title: "Not Connected",
        description: "Please wait for the chat service to connect",
        variant: "destructive"
      });
      return;
    }

    const success = await sendMessage(input.trim());
    if (success) {
      setInput('');
    }
  };

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setIsRecording(true);
      toast({
        title: "Recording Started",
        description: "Speak clearly into your microphone",
      });
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: "Recording Error",
        description: "Could not start recording. Please check microphone permissions.",
        variant: "destructive"
      });
    }
  };

  const handleStopRecording = async () => {
    setIsRecording(false);
    toast({
      title: "Recording Stopped",
      description: "Processing your message...",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t flex gap-2 bg-white">
      <Button
        type="button"
        size="icon"
        onClick={isRecording ? handleStopRecording : handleStartRecording}
        className={`${
          isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-gold hover:bg-gold-light'
        } text-white`}
        disabled={status !== 'connected'}
      >
        {isRecording ? (
          <MicOff className="h-4 w-4" />
        ) : (
          <Mic className="h-4 w-4" />
        )}
      </Button>
      
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={status === 'connected' ? "Type your message..." : "Connecting..."}
        className="flex-1 bg-white text-gray-900 border-gray-300"
        disabled={status !== 'connected'}
      />
      
      <Button 
        type="submit" 
        size="icon"
        className="bg-gold hover:bg-gold-light text-space"
        disabled={status !== 'connected' || isLoading}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
      </Button>
    </form>
  );
};

const ChatBotContent = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-[9999]">
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full w-14 h-14 bg-gold hover:bg-gold-light shadow-lg"
        >
          <MessageCircle className="h-6 w-6 text-space" />
        </Button>
      )}

      {isOpen && (
        <Card className="w-[380px] h-[600px] flex flex-col shadow-xl bg-white">
          <div className="p-4 border-b flex justify-between items-center bg-gold text-space">
            <h3 className="font-semibold text-lg">Chat with AI Assistant</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 text-space hover:bg-gold-light"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <ChatMessages />
          <ChatInput />
        </Card>
      )}
    </div>
  );
};

const ChatBot = () => {
  return <ChatBotContent />;
};

export default ChatBot;