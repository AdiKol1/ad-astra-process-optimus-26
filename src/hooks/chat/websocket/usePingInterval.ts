import { useCallback, useRef } from 'react';

export const usePingInterval = () => {
  const pingIntervalRef = useRef<number | null>(null);

  const setupPingInterval = useCallback((ws: WebSocket) => {
    if (pingIntervalRef.current) {
      clearInterval(pingIntervalRef.current);
    }
    
    pingIntervalRef.current = window.setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        console.log('Sending ping');
        ws.send(JSON.stringify({ type: 'ping' }));
      } else {
        console.log('WebSocket not open, clearing ping interval');
        clearInterval(pingIntervalRef.current!);
      }
    }, 30000);
  }, []);

  const cleanup = useCallback(() => {
    if (pingIntervalRef.current) {
      clearInterval(pingIntervalRef.current);
      pingIntervalRef.current = null;
    }
  }, []);

  return { setupPingInterval, cleanup };
};