import { useRef } from 'react';
import { AudioRecorder } from '@/utils/audio/AudioRecorder';
import { AudioQueue } from '@/utils/audio/AudioQueue';
import { useToast } from '@/hooks/use-toast';

export const useAudioHandling = () => {
  const recorderRef = useRef<AudioRecorder | null>(null);
  const audioQueueRef = useRef<AudioQueue | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const { toast } = useToast();

  const initializeAudio = () => {
    // Only create AudioContext after user interaction
    const initContext = () => {
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext();
        audioQueueRef.current = new AudioQueue(audioContextRef.current);
      }
    };

    // Add event listeners for user interaction
    const userInteractionEvents = ['click', 'touchstart', 'keydown'];
    const handleUserInteraction = () => {
      initContext();
      // Remove listeners after initialization
      userInteractionEvents.forEach(event => 
        document.removeEventListener(event, handleUserInteraction)
      );
    };

    userInteractionEvents.forEach(event => 
      document.addEventListener(event, handleUserInteraction)
    );
  };

  const startRecording = async () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext();
        audioQueueRef.current = new AudioQueue(audioContextRef.current);
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

  const handleAudioData = (data: string) => {
    if (!audioQueueRef.current) return;
    
    const binaryString = atob(data);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    audioQueueRef.current.addToQueue(bytes);
  };

  return {
    initializeAudio,
    startRecording,
    stopRecording,
    handleAudioData
  };
};