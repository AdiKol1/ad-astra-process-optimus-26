import { useState, useRef } from 'react';

export const useAudioHandling = () => {
  const [isRecording, setIsRecording] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioBufferRef = useRef<Float32Array[]>([]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const initializeAudio = async () => {
    try {
      audioContextRef.current = new AudioContext();
    } catch (error) {
      console.error('Failed to initialize audio context:', error);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioBufferRef.current = [];
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          const reader = new FileReader();
          reader.onloadend = () => {
            if (reader.result instanceof ArrayBuffer) {
              audioContextRef.current?.decodeAudioData(reader.result, (buffer) => {
                audioBufferRef.current.push(buffer.getChannelData(0));
              });
            }
          };
          reader.readAsArrayBuffer(event.data);
        }
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Failed to start recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      return audioBufferRef.current;
    }
    return null;
  };

  const handleAudioData = async (audioData: Float32Array) => {
    if (!audioContextRef.current) return;
    
    const buffer = audioContextRef.current.createBuffer(1, audioData.length, audioContextRef.current.sampleRate);
    buffer.copyToChannel(audioData, 0);
    
    const source = audioContextRef.current.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContextRef.current.destination);
    source.start();
  };

  return {
    isRecording,
    initializeAudio,
    startRecording,
    stopRecording,
    handleAudioData
  };
};