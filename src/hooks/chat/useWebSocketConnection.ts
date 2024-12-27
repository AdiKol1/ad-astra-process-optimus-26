import { useRef, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useWebSocketConnection = () => {
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<number | null>(null);
  const { toast } = useToast();

  const cleanup = () => {
    console.log('Cleaning up WebSocket connection');
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  };

  const setupWebSocket = (jwt: string) => {
    cleanup();

    console.log('Setting up WebSocket connection...');
    
    try {
      const ws = new WebSocket(
        `wss://gjkagdysjgljjbnagoib.functions.supabase.co/functions/v1/realtime-chat?jwt=${jwt}`
      );
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('WebSocket connection established');
        setIsConnected(true);
        toast({
          title: "Connected",
          description: "Chat service is ready",
        });

        ws.send(JSON.stringify({
          type: "session.update",
          session: {
            modalities: ["text", "audio"],
            instructions: "You are a helpful AI assistant focused on helping users understand and optimize their business processes.",
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
            },
            temperature: 0.7,
            max_response_output_tokens: "inf"
          }
        }));
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
        console.log('WebSocket connection closed');
        setIsConnected(false);
        
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
        }
        
        reconnectTimeoutRef.current = window.setTimeout(() => {
          console.log('Attempting to reconnect...');
          setupWebSocket(jwt);
        }, 2000);
      };

      return ws;
    } catch (error) {
      console.error('Error setting up WebSocket:', error);
      toast({
        title: "Connection Error",
        description: "Failed to initialize chat service",
        variant: "destructive"
      });
      return null;
    }
  };

  useEffect(() => {
    return () => cleanup();
  }, []);

  return {
    isConnected,
    wsRef,
    setupWebSocket,
    cleanup
  };
};