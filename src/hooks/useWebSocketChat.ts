import { useRef, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { AudioRecorder } from '@/utils/audio/AudioRecorder';
import { AudioQueue } from '@/utils/audio/AudioQueue';
import type { Message } from '@/types/chat';

export const useWebSocketChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const recorderRef = useRef<AudioRecorder | null>(null);
  const audioQueueRef = useRef<AudioQueue | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    audioQueueRef.current = new AudioQueue();
    setupWebSocket();

    return () => {
      wsRef.current?.close();
      recorderRef.current?.stop();
    };
  }, []);

  const setupWebSocket = () => {
    console.log('Setting up WebSocket connection...');
    const ws = new WebSocket(`wss://gjkagdysjgljjbnagoib.functions.supabase.co/realtime-chat`);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('Connected to chat server');
      setIsConnected(true);
      toast({
        title: "Connected",
        description: "Chat service is ready",
      });
    };

    ws.onmessage = async (event) => {
      console.log('Received message:', event.data);
      const data = JSON.parse(event.data);
      
      if (data.type === 'response.audio.delta') {
        const binaryString = atob(data.delta);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        audioQueueRef.current?.addToQueue(bytes);
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
      } else if (data.type === 'error') {
        console.error('WebSocket error:', data.error);
        toast({
          title: "Error",
          description: data.error,
          variant: "destructive"
        });
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsConnected(false);
      toast({
        title: "Connection Error",
        description: "Failed to connect to chat service",
        variant: "destructive"
      });
    };

    ws.onclose = () => {
      console.log('WebSocket closed');
      setIsConnected(false);
      setTimeout(() => {
        if (!wsRef.current || wsRef.current.readyState === WebSocket.CLOSED) {
          setupWebSocket();
        }
      }, 5000);
    };
  };

  const startRecording = async () => {
    try {
      if (!isConnected) {
        toast({
          title: "Not Connected",
          description: "Please wait for the chat service to connect",
          variant: "destructive"
        });
        return;
      }

      recorderRef.current = new AudioRecorder((audioData) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
          const base64Audio = btoa(String.fromCharCode(...new Uint8Array(audioData.buffer)));
          wsRef.current.send(JSON.stringify({
            type: 'input_audio_buffer.append',
            audio: base64Audio
          }));
        }
      });

      await recorderRef.current.start();

      wsRef.current?.send(JSON.stringify({
        type: 'session.update',
        session: {
          modalities: ["text", "audio"],
          instructions: "You are a helpful AI assistant. Your responses should be concise and natural.",
          voice: "alloy",
          input_audio_format: "pcm16",
          output_audio_format: "pcm16",
          input_audio_transcription: {
            model: "whisper-1"
          },
          turn_detection: {
            type: "server_vad",
            threshold: 0.5,
            prefix_padding_ms: 300,
            silence_duration_ms: 1000
          }
        }
      }));

      return true;
    } catch (error) {
      console.error('Failed to start recording:', error);
      toast({
        title: "Error",
        description: "Failed to access microphone",
        variant: "destructive"
      });
      return false;
    }
  };

  const stopRecording = () => {
    recorderRef.current?.stop();
  };

  const sendTextMessage = (text: string) => {
    if (!text.trim()) return false;

    if (!isConnected) {
      toast({
        title: "Not Connected",
        description: "Please wait for the chat service to connect",
        variant: "destructive"
      });
      return false;
    }

    setMessages(prev => [...prev, { content: text, isBot: false }]);

    wsRef.current?.send(JSON.stringify({
      type: 'conversation.item.create',
      item: {
        type: 'message',
        role: 'user',
        content: [{ type: 'input_text', text }]
      }
    }));
    wsRef.current?.send(JSON.stringify({ type: 'response.create' }));
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