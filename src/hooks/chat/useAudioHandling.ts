import { useState, useRef, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useAudioHandling = () => {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const { toast } = useToast();

  const initializeAudio = useCallback(async () => {
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error('Audio recording is not supported in this browser');
      }
    } catch (error) {
      console.error('Failed to initialize audio:', error);
      toast({
        title: "Audio Error",
        description: "Could not initialize audio recording",
        variant: "destructive"
      });
    }
  }, [toast]);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      return true;
    } catch (error) {
      console.error('Failed to start recording:', error);
      toast({
        title: "Recording Error",
        description: "Could not start audio recording",
        variant: "destructive"
      });
      return false;
    }
  }, [toast]);

  const stopRecording = useCallback(() => {
    return new Promise<Blob | null>((resolve) => {
      if (!mediaRecorderRef.current || !isRecording) {
        setIsRecording(false);
        resolve(null);
        return;
      }

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        audioChunksRef.current = [];
        setIsRecording(false);
        resolve(audioBlob);
      };

      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    });
  }, [isRecording]);

  return {
    isRecording,
    initializeAudio,
    startRecording,
    stopRecording
  };
};