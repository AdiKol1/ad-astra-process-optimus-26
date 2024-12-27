import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useWebSocketConnection } from '@/hooks/chat/useWebSocketConnection';

interface Message {
  content: string;
  isUser: boolean;
}

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { content: "Hi! I'm your AI assistant. Ask me anything about our services!", isUser: false }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { isConnected, wsRef, setupWebSocket, cleanup } = useWebSocketConnection();

  React.useEffect(() => {
    if (isOpen) {
      const ws = setupWebSocket();
      return () => cleanup();
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    if (!isConnected || !wsRef.current) {
      toast({
        title: "Not Connected",
        description: "Please wait for the chat service to connect",
        variant: "destructive"
      });
      return;
    }

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { content: userMessage, isUser: true }]);
    setIsLoading(true);

    try {
      wsRef.current.send(JSON.stringify({
        type: 'conversation.item.create',
        item: {
          type: 'message',
          role: 'user',
          content: [{ type: 'input_text', text: userMessage }]
        }
      }));
      wsRef.current.send(JSON.stringify({ type: 'response.create' }));
    } catch (error) {
      console.error('Chat error:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
      setIsLoading(false);
    }
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
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
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
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-4 ${
                      message.isUser
                        ? 'bg-gold text-space font-medium'
                        : 'bg-gray-200 text-gray-900 font-medium'
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
            </div>
          </ScrollArea>

          <form onSubmit={handleSubmit} className="p-4 border-t flex gap-2 bg-white">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isConnected ? "Type your message..." : "Connecting to chat service..."}
              className="flex-1 bg-white text-gray-900 border-gray-300"
              disabled={!isConnected}
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