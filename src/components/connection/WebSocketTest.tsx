import { useState, useCallback, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

export const WebSocketTest = () => {
  const [status, setStatus] = useState<string>('Not tested');
  const [error, setError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);

  const testConnection = useCallback(() => {
    if (isConnecting) return;
    
    setIsConnecting(true);
    setError(null);
    setStatus('Initializing...');

    try {
      console.log('Initializing WebSocket connection test');
      const ws = new WebSocket('wss://gjkagdysjgljjbnagoib.functions.supabase.co/functions/v1/realtime-chat');
      
      const connectionTimeout = setTimeout(() => {
        if (ws.readyState !== WebSocket.OPEN) {
          ws.close();
          setStatus('Connection timeout after 5s');
          setError('Connection attempt timed out');
          setIsConnecting(false);
          toast({
            title: "Connection Timeout",
            description: "Connection attempt timed out after 5 seconds",
            variant: "destructive"
          });
        }
      }, 5000);

      ws.onopen = () => {
        clearTimeout(connectionTimeout);
        console.log('WebSocket connected successfully');
        setStatus('Connected');
        setIsConnecting(false);

        // Send a test message
        ws.send(JSON.stringify({
          type: 'test',
          content: 'Hello from WebSocket test!'
        }));
      };

      ws.onmessage = (event) => {
        console.log('Message received:', event.data);
        try {
          const data = JSON.parse(event.data);
          setMessages(prev => [...prev, JSON.stringify(data, null, 2)]);
          setStatus('Message received');
        } catch (err) {
          console.error('Error parsing message:', err);
          setStatus('Error parsing message');
        }
      };

      ws.onclose = (event) => {
        clearTimeout(connectionTimeout);
        console.log('WebSocket closed:', event);
        setStatus(`Closed: ${event.code}`);
        setIsConnecting(false);
        
        if (!event.wasClean) {
          const errorMsg = `Connection closed abnormally (${event.code})`;
          setError(errorMsg);
          toast({
            title: "Connection Closed",
            description: errorMsg,
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
          title: "Connection Error",
          description: "Failed to establish connection",
          variant: "destructive"
        });
      };

      return () => {
        clearTimeout(connectionTimeout);
        if (ws.readyState === WebSocket.OPEN) {
          ws.close();
        }
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error('Setup error:', errorMessage);
      setError(`Setup failed: ${errorMessage}`);
      setIsConnecting(false);
      toast({
        title: "Setup Failed",
        description: errorMessage,
        variant: "destructive"
      });
    }
  }, [isConnecting]);

  return (
    <div className="flex flex-col gap-4 p-4 border rounded-lg">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">WebSocket Connection Test</h2>
        <Button 
          onClick={testConnection}
          disabled={isConnecting}
          className="min-w-[120px]"
        >
          {isConnecting ? 'Connecting...' : 'Test Connection'}
        </Button>
      </div>
      
      <div className="flex items-center gap-2">
        <span className="font-mono text-sm">Status:</span>
        <span className="text-sm">{status}</span>
      </div>
      
      {error && (
        <div className="p-3 bg-red-100 border border-red-300 rounded text-red-700 text-sm">
          {error}
        </div>
      )}

      {messages.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-semibold mb-2">Messages Received:</h3>
          <div className="space-y-2">
            {messages.map((msg, idx) => (
              <pre key={idx} className="p-2 bg-gray-100 rounded text-sm overflow-x-auto">
                {msg}
              </pre>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};