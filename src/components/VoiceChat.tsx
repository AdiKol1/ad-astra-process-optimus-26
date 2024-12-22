import React, { useEffect, useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mic, MicOff, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AudioRecorder } from '@/utils/audio/AudioRecorder';
import { AudioQueue } from '@/utils/audio/AudioQueue';
import { ChatMessage } from './chat/ChatMessage';

interface Message {
  content: string;
  isBot: boolean;
}

export const VoiceChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const recorderRef = useRef<AudioRecorder | null>(null);
  const audioQueueRef = useRef<AudioQueue | null>(null);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    audioQueueRef.current = new AudioQueue();
    setupWebSocket();

    return () => {
      wsRef.current?.close();
      recorderRef.current?.stop();
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
      // Attempt to reconnect after a delay
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
      setIsRecording(true);

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
    } catch (error) {
      console.error('Failed to start recording:', error);
      toast({
        title: "Error",
        description: "Failed to access microphone",
        variant: "destructive"
      });
    }
  };

  const stopRecording = () => {
    recorderRef.current?.stop();
    setIsRecording(false);
  };

  const sendMessage = () => {
    if (!inputText.trim()) return;

    if (!isConnected) {
      toast({
        title: "Not Connected",
        description: "Please wait for the chat service to connect",
        variant: "destructive"
      });
      return;
    }

    const message = inputText.trim();
    setMessages(prev => [...prev, { content: message, isBot: false }]);
    setInputText('');

    wsRef.current?.send(JSON.stringify({
      type: 'conversation.item.create',
      item: {
        type: 'message',
        role: 'user',
        content: [{ type: 'input_text', text: message }]
      }
    }));
    wsRef.current?.send(JSON.stringify({ type: 'response.create' }));
  };

  return (
    <Card className="fixed bottom-4 right-4 w-[400px] h-[600px] flex flex-col bg-white shadow-xl z-50">
      <div className="p-4 border-b flex justify-between items-center bg-primary text-primary-foreground">
        <h3 className="font-semibold">AI Assistant</h3>
        <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <ChatMessage key={index} {...message} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t flex gap-2">
        <Button
          onClick={isRecording ? stopRecording : startRecording}
          variant={isRecording ? "destructive" : "outline"}
          size="icon"
          className="shrink-0"
          disabled={!isConnected}
        >
          {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
        </Button>
        
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type your message..."
          className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        />
        
        <Button
          onClick={sendMessage}
          variant="default"
          size="icon"
          className="shrink-0"
          disabled={!isConnected}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};