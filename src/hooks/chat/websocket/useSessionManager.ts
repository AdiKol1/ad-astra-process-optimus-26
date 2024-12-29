import { useCallback } from 'react';

export const useSessionManager = () => {
  const initializeSession = useCallback((ws: WebSocket) => {
    const handleSessionCreated = (event: any) => {
      if (event.type === 'session.created') {
        console.log('Session created, configuring audio settings...');
        ws.send(JSON.stringify({
          type: 'session.update',
          session: {
            modalities: ['text', 'audio'],
            instructions: 'You are a helpful AI assistant.',
            voice: 'alloy',
            input_audio_format: 'pcm16',
            output_audio_format: 'pcm16',
            input_audio_transcription: {
              model: 'whisper-1'
            },
            turn_detection: {
              type: 'server_vad',
              threshold: 0.5,
              prefix_padding_ms: 300,
              silence_duration_ms: 1000
            }
          }
        }));
      }
    };

    ws.addEventListener('message', (event) => {
      try {
        const data = JSON.parse(event.data);
        handleSessionCreated(data);
      } catch (error) {
        console.error('Error handling session message:', error);
      }
    });
  }, []);

  return { initializeSession };
};