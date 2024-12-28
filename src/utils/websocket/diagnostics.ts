export const logWebSocketEvent = (
  event: string,
  details: any,
  requestId?: string
) => {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    event,
    requestId,
    details,
  };
  console.log(`[WebSocket][${timestamp}]`, logEntry);
  return logEntry;
};

export const measureLatency = () => {
  const start = performance.now();
  return () => {
    const duration = performance.now() - start;
    return Math.round(duration);
  };
};

export const getConnectionMetrics = (ws: WebSocket) => ({
  readyState: ws.readyState,
  bufferedAmount: ws.bufferedAmount,
  protocol: ws.protocol,
  url: ws.url,
});