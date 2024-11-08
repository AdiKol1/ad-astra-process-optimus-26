import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface Message {
  content: string;
  isUser: boolean;
  source?: 'chatgpt' | 'perplexity';
}

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { content: "Hi! I'm your AI assistant. Ask me anything about our services!", isUser: false }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { content: userMessage, isUser: true }]);
    setIsLoading(true);

    try {
      // Simulate API calls to both services
      // In a real implementation, you would make actual API calls here
      const response = await Promise.race([
        new Promise(resolve => setTimeout(() => resolve({
          content: "Thanks for your question! Our AI-powered marketing solutions combine cutting-edge technology with proven strategies to help businesses grow. We offer personalized campaigns, data analytics, and real-time optimization.",
          source: 'chatgpt'
        }), 1000)),
        new Promise(resolve => setTimeout(() => resolve({
          content: "We provide comprehensive digital marketing services including SEO, content marketing, social media management, and PPC advertising. Our team uses AI to optimize your campaigns for maximum ROI.",
          source: 'perplexity'
        }), 1500))
      ]);

      setMessages(prev => [...prev, { 
        content: response.content, 
        isUser: false,
        source: response.source as 'chatgpt' | 'perplexity'
      }]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get response. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full w-12 h-12 bg-gold hover:bg-gold-light"
        >
          <MessageCircle className="h-6 w-6 text-space" />
        </Button>
      )}

      {isOpen && (
        <Card className="w-[350px] h-[500px] flex flex-col">
          <div className="p-4 border-b flex justify-between items-center bg-gold text-space">
            <h3 className="font-semibold">Chat with AI Assistant</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 text-space hover:bg-gold-light"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.isUser
                        ? 'bg-gold text-space'
                        : 'bg-space-light text-white'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    {message.source && (
                      <span className="text-xs opacity-70 mt-1 block">
                        via {message.source}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <form onSubmit={handleSubmit} className="p-4 border-t flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button 
              type="submit" 
              size="icon"
              disabled={isLoading}
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