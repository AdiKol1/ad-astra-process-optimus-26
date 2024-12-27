import { useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface WebSocketTestProps {
  baseUrl: string;
  anonKey: string;
}

export const WebSocketTest = ({ baseUrl, anonKey }: WebSocketTestProps) => {
  const [status, setStatus] = useState<string>('Not tested');
  const [error, setError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const testConnection = useCallback(() => {
    if (isConnecting) return;
    
    setIsConnecting(true);
    setError(null);
    setStatus('Initializing...');

    try {
      // Use the realtime endpoint instead of functions
      const wsUrl = `wss://${baseUrl}/realtime/v1/websocket?apikey=${encodeURIComponent(anonKey)}`;
      console.log('Initializing WebSocket:', wsUrl);
      
      const ws = new WebSocket(wsUrl);
      
      const connectionTimeout = setTimeout(() => {
        if (ws.readyState !== WebSocket.OPEN) {
          console.warn('WebSocket connection timeout');
          ws.close(1000, 'Connection timeout');
          setStatus('Timeout after 10s');
          setError('Connection attempt timed out');
          setIsConnecting(false);
          toast({
            title: "WebSocket Connection Timeout",
            description: "Connection attempt timed out after 10 seconds",
            variant: "destructive"
          });
        }
      }, 10000);

      ws.onopen = () => {
        clearTimeout(connectionTimeout);
        console.log('WebSocket connected successfully');
        setStatus('Connected');
        setIsConnecting(false);
        toast({
          title: "WebSocket Connected",
          description: "Connection established successfully",
        });

        // Send test message
        ws.send(JSON.stringify({
          type: 'test',
          timestamp: Date.now()
        }));
      };

      ws.onmessage = (event) => {
        console.log('Message received:', event.data);
        try {
          const data = JSON.parse(event.data);
          setStatus(`Active: ${JSON.stringify(data)}`);
        } catch (err) {
          console.error('Message parsing error:', err);
          setStatus(`Received: ${event.data}`);
        }
      };

      ws.onclose = (event) => {
        clearTimeout(connectionTimeout);
        console.log('WebSocket closed:', {
          code: event.code,
          reason: event.reason,
          wasClean: event.wasClean
        });
        
        setStatus(`Closed: ${event.code}`);
        setIsConnecting(false);
        
        if (!event.wasClean) {
          setError(`Connection closed abnormally (${event.code})`);
          toast({
            title: "WebSocket Connection Closed",
            description: `Connection closed abnormally (code: ${event.code})`,
            variant: "destructive"
          });
        }
      };

      ws.onerror = (event) => {
        clearTimeout(connectionTimeout);
        console.error('WebSocket error:', event);
        setStatus('Connection error');
        setError('Failed to establish connection');
        setIsConnecting(false);
        toast({
          title: "WebSocket Error",
          description: "Failed to establish connection",
          variant: "destructive"
        });
      };

      return () => {
        clearTimeout(connectionTimeout);
        if (ws.readyState === WebSocket.OPEN) {
          ws.close(1000, 'Test complete');
        }
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error('Setup error:', errorMessage);
      setError(`Setup failed: ${errorMessage}`);
      setIsConnecting(false);
      toast({
        title: "WebSocket Setup Failed",
        description: errorMessage,
        variant: "destructive"
      });
    }
  }, [baseUrl, anonKey, isConnecting]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center">
        <Button 
          onClick={testConnection}
          disabled={isConnecting}
          className={`${
            isConnecting ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600'
          } text-white px-4 py-2 rounded mr-2 transition-colors`}
        >
          {isConnecting ? 'Connecting...' : 'Test WebSocket'}
        </Button>
        <span className="ml-2 font-mono text-sm">{status}</span>
      </div>
      
      {error && (
        <div className="mt-2 p-3 bg-red-100 border border-red-300 rounded text-red-700 text-sm">
          {error}
        </div>
      )}
    </div>
  );
};