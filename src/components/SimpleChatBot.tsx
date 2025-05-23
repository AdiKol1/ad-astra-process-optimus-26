import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  content: string;
  isBot: boolean;
  timestamp: string;
}

const SimpleChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      content: "Hi! I'm your AI assistant. How can I help you with your process optimization today?",
      isBot: true,
      timestamp: new Date().toISOString()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const sendMessage = async (messageContent: string): Promise<boolean> => {
    if (!messageContent.trim()) return false;

    // Add user message immediately
    const userMessage: Message = {
      content: messageContent,
      isBot: false,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Simple AI responses for now - you can enhance this with actual AI later
      const responses = [
        "That's a great question about process optimization! Let me help you explore that.",
        "I understand you're looking to improve your workflows. Can you tell me more about your specific challenges?",
        "Process optimization is key to business success. What area of your operations are you most concerned about?",
        "I'd be happy to help you identify optimization opportunities. What's your biggest operational pain point?",
        "That's an excellent point. Have you considered implementing automation in that area?",
        "Based on what you've shared, I can see several opportunities for improvement. Would you like me to elaborate?",
        "Process efficiency is crucial for competitive advantage. What metrics are you currently tracking?",
        "I can help you analyze that workflow. What steps are currently taking the most time?",
        "That sounds like a common challenge many businesses face. Let's break it down step by step.",
        "Great insight! That approach could significantly improve your operational efficiency."
      ];

      // Simulate AI processing time
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

      const botResponse: Message = {
        content: responses[Math.floor(Math.random() * responses.length)],
        isBot: true,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, botResponse]);
      
      // Optional: Log conversation to Supabase for analytics
      try {
        await (supabase as any)
          .from('logs')
          .insert([{
            level: 'info',
            message: 'Chat interaction',
            data: {
              user_message: messageContent,
              bot_response: botResponse.content,
              session_id: sessionStorage.getItem('log_session_id') || 'unknown'
            },
            environment: 'development',
            source: 'chatbot'
          }]);
        console.log('Chat interaction logged successfully');
      } catch (logError) {
        console.log('Chat interaction (logging disabled):', {
          user_message: messageContent,
          bot_response: botResponse.content,
          session_id: sessionStorage.getItem('log_session_id') || 'unknown'
        });
      }

      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const success = await sendMessage(input.trim());
    if (success) {
      setInput('');
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-[9999]">
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full w-14 h-14 bg-blue-600 hover:bg-blue-700 shadow-lg"
        >
          <MessageCircle className="h-6 w-6 text-white" />
        </Button>
      )}

      {isOpen && (
        <Card className="w-[380px] h-[600px] flex flex-col shadow-xl bg-white">
          <div className="p-4 border-b flex justify-between items-center bg-blue-600 text-white">
            <h3 className="font-semibold text-lg">Chat with AI Assistant</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 text-white hover:bg-blue-700"
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
                        ? 'bg-white text-gray-900 border border-gray-200'
                        : 'bg-blue-600 text-white'
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          <form onSubmit={handleSubmit} className="p-4 border-t flex gap-2 bg-white">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-white text-gray-900 border-gray-300"
              disabled={isLoading}
            />
            
            <Button 
              type="submit" 
              size="icon"
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isLoading || !input.trim()}
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

export default SimpleChatBot; 