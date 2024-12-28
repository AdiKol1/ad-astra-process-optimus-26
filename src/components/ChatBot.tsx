import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, X, Send, Mic, MicOff, Loader2, WifiOff } from 'lucide-react';
import { WebSocketProvider } from './chat/WebSocketProvider';
import { MessageHandler } from './chat/MessageHandler';
import { useToast } from '@/hooks/use-toast';
import type { Message } from '@/types/chat';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleMessageReceived = (message: Message) => {
    setMessages(prev => [...prev, message]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const success = await sendTextMessage(input.trim());
    if (success) {
      setInput('');
    }
  };

  const handleStartRecording = async () => {
    try {
      const started = await startRecording();
      if (started) {
        setIsRecording(true);
        toast({
          title: "Recording Started",
          description: "Speak clearly into your microphone",
        });
      }
    } catch (error) {
      toast({
        title: "Recording Error",
        description: "Could not start recording. Please check microphone permissions.",
        variant: "destructive"
      });
    }
  };

  const handleStopRecording = async () => {
    await stopRecording();
    setIsRecording(false);
    toast({
      title: "Recording Stopped",
      description: "Processing your message...",
    });
  };

  return (
    <WebSocketProvider>
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
                <span className="text-xs flex items-center">
                  {getConnectionStatus()}
                  {getConnectionIcon()}
                </span>
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
              {!isConnected && !isReconnecting && (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <WifiOff className="h-12 w-12 mb-4" />
                  <p className="text-center">
                    Connection lost. Please check your internet connection or try refreshing the page.
                  </p>
                </div>
              )}
              {isReconnecting && (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <Loader2 className="h-12 w-12 mb-4 animate-spin" />
                  <p className="text-center">
                    Reconnecting to chat service...
                  </p>
                </div>
              )}
              {(isConnected || messages.length > 0) && (
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
              )}
            </ScrollArea>

            <form onSubmit={handleSubmit} className="p-4 border-t flex gap-2 bg-white">
              <Button
                type="button"
                size="icon"
                onClick={isRecording ? handleStopRecording : handleStartRecording}
                className={`${
                  isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-gold hover:bg-gold-light'
                } text-white`}
                disabled={!isConnected || isLoading}
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
                placeholder={
                  !isConnected 
                    ? "Connecting to chat service..." 
                    : isReconnecting 
                      ? "Reconnecting..." 
                      : "Type your message..."
                }
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
    </WebSocketProvider>
  );
};

export default ChatBot;
