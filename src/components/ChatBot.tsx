import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useWebSocketChat } from '@/hooks/useWebSocketChat';

interface Message {
  content: string;
  isBot: boolean;
}

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const { messages, isConnected, isReconnecting, isLoading, sendTextMessage } = useWebSocketChat();
  const { toast } = useToast();
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const success = await sendTextMessage(input.trim());
    if (success) {
      setInput('');
    }
  };

  const getConnectionStatus = () => {
    if (isConnected) return 'Connected';
    if (isReconnecting) return 'Reconnecting...';
    return 'Disconnected';
  };

  const getConnectionColor = () => {
    if (isConnected) return 'bg-green-500';
    if (isReconnecting) return 'bg-yellow-500';
    return 'bg-red-500';
  };

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
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-lg">Chat with AI Assistant</h3>
              <div className={`w-2 h-2 rounded-full ${getConnectionColor()}`} />
              <span className="text-xs">{getConnectionStatus()}</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 text-space hover:bg-gold-light"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

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
                        ? 'bg-gray-200 text-gray-900 font-medium'
                        : 'bg-gold text-space font-medium'
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-gold" />
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          <form onSubmit={handleSubmit} className="p-4 border-t flex gap-2 bg-white">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isConnected ? "Type your message..." : "Connecting to chat service..."}
              className="flex-1 bg-white text-gray-900 border-gray-300"
              disabled={!isConnected || isLoading}
            />
            <Button 
              type="submit" 
              size="icon"
              disabled={!isConnected || isLoading}
              className="bg-gold hover:bg-gold-light text-space"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>
        </Card>
      )}
    </div>
  );
};

export default ChatBot;