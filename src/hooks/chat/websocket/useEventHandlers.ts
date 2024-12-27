import { useCallback } from 'react';
import { WebSocketState } from './types';

export const useEventHandlers = (
  wsRef: React.MutableRefObject<WebSocket | null>,
  setConnected: (connected: boolean) => void,
  setReconnecting: (reconnecting: boolean) => void,
  setupPingInterval: (ws: WebSocket) => void,
  initializeSession: (ws: WebSocket) => void
) => {
  const handleOpen = useCallback((ws: WebSocket) => {
    console.log('WebSocket connection established successfully');
    setConnected(true);
    setReconnecting(false);
    setupPingInterval(ws);
    initializeSession(ws);

    ws.send(JSON.stringify({
      type: 'auth',
      params: {
        headers: {
          apikey: wsRef.current?.url.split('apikey=')[1],
          Authorization: `Bearer ${wsRef.current?.url.split('apikey=')[1]}`
        }
      }
    }));
  }, [setConnected, setReconnecting, setupPingInterval, initializeSession]);

  const handleError = useCallback((error: Event) => {
    console.error('WebSocket error:', error);
    setConnected(false);
  }, [setConnected]);

  const handleClose = useCallback((event: CloseEvent) => {
    console.log('WebSocket connection closed', {
      code: event.code,
      reason: event.reason,
      wasClean: event.wasClean
    });
    setConnected(false);
  }, [setConnected]);

  return { handleOpen, handleError, handleClose };
};