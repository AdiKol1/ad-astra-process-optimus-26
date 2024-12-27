import { useEffect, useState } from 'react';
import { useAudioHandling } from './chat/useAudioHandling';
import { useWebSocketConnection } from './chat/useWebSocketConnection';
import { useToast } from '@/hooks/use-toast';
import type { Message } from '@/types/chat';

export const useWebSocketChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const { isConnected, wsRef, setupWebSocket, cleanup } = useWebSocketConnection();
  const { initializeAudio, startRecording, stopRecording, handleAudioData } = useAudioHandling();
  const { toast } = useToast();

  useEffect(() => {
    const initializeChat = async () => {
      console.log('Initializing audio...');
      initializeAudio();
      
      console.log('Setting up WebSocket...');
      const ws = setupWebSocket();

      ws.onmessage = async (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('Received message:', data);
          
          if (data.type === 'response.audio.delta') {
            handleAudioData(data.delta);
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
      };
    };

    initializeChat();
    return () => cleanup();
  }, []);

  const sendTextMessage = (text: string) => {
    if (!text.trim()) return false;

    if (!isConnected || !wsRef.current) {
      toast({
        title: "Not Connected",
        description: "Please wait for the chat service to connect",
        variant: "destructive"
      });
      return false;
    }

    console.log('Sending text message:', text);
    setMessages(prev => [...prev, { content: text, isBot: false }]);

    wsRef.current.send(JSON.stringify({
      type: 'conversation.item.create',
      item: {
        type: 'message',
        role: 'user',
        content: [{ type: 'input_text', text }]
      }
    }));
    wsRef.current.send(JSON.stringify({ type: 'response.create' }));
    return true;
  };

  return {
    messages,
    isConnected,
    startRecording,
    stopRecording,
    sendTextMessage
  };
};