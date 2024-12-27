import { useRef, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

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

  const setupWebSocket = async () => {
    cleanup(); // Clean up any existing connection

    console.log('Setting up WebSocket connection...');
    
    // Get the current session
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      console.error('No active session');
      toast({
        title: "Authentication Required",
        description: "Please sign in to use the chat feature",
        variant: "destructive"
      });
      return null;
    }

    try {
      const ws = new WebSocket(
        `wss://gjkagdysjgljjbnagoib.functions.supabase.co/functions/v1/realtime-chat?jwt=${session.access_token}`
      );
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('WebSocket connection established');
        setIsConnected(true);
        toast({
          title: "Connected",
          description: "Chat service is ready",
        });

        // Send session configuration after connection is established
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
        
        // Clear any existing reconnection timeout
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
        }
        
        // Attempt to reconnect after 2 seconds
        reconnectTimeoutRef.current = window.setTimeout(() => {
          console.log('Attempting to reconnect...');
          setupWebSocket();
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

  // Clean up on unmount
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