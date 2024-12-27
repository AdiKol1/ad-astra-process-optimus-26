import { useState, useCallback } from 'react';

const ConnectionTest = () => {
  const [httpStatus, setHttpStatus] = useState<string>('Not tested');
  const [wsStatus, setWsStatus] = useState<string>('Not tested');
  const [error, setError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  
  const baseUrl = 'gjkagdysjgljjbnagoib.supabase.co';
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  const testHTTP = useCallback(async () => {
    try {
      setHttpStatus('Testing...');
      const testUrl = `https://${baseUrl}/functions/v1/realtime-chat`;
      console.log('Testing HTTP connection:', testUrl);
      
      const response = await fetch(testUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${anonKey}`
        }
      });

      console.log('HTTP Response:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries())
      });

      const responseText = await response.text();
      try {
        const jsonData = JSON.parse(responseText);
        setHttpStatus(`Success (${response.status}): ${JSON.stringify(jsonData)}`);
      } catch {
        setHttpStatus(`Response (${response.status}): ${responseText}`);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error('HTTP Test Error:', errorMessage);
      setHttpStatus(`Failed: ${errorMessage}`);
    }
  }, [baseUrl, anonKey]);

  const testWebSocket = useCallback(() => {
    if (isConnecting) return;
    
    setIsConnecting(true);
    setError(null);
    setWsStatus('Initializing...');

    try {
      const wsUrl = `wss://${baseUrl}/functions/v1/realtime-chat`;
      console.log('Initializing WebSocket:', wsUrl);
      
      const ws = new WebSocket(wsUrl);
      
      // Set connection timeout
      const connectionTimeout = setTimeout(() => {
        if (ws.readyState !== WebSocket.OPEN) {
          console.warn('WebSocket connection timeout');
          ws.close(1000, 'Connection timeout');
          setWsStatus('Timeout after 10s');
          setError('Connection attempt timed out');
          setIsConnecting(false);
        }
      }, 10000);

      ws.onopen = () => {
        clearTimeout(connectionTimeout);
        console.log('WebSocket connected successfully');
        setWsStatus('Connected');
        setIsConnecting(false);
        
        // Send test message
        const testMessage = {
          type: 'test',
          timestamp: Date.now()
        };
        ws.send(JSON.stringify(testMessage));
      };

      ws.onmessage = (event) => {
        console.log('Message received:', event.data);
        try {
          const data = JSON.parse(event.data);
          setWsStatus(`Active: ${JSON.stringify(data)}`);
        } catch (err) {
          console.error('Message parsing error:', err);
          setWsStatus(`Received: ${event.data}`);
        }
      };

      ws.onclose = (event) => {
        clearTimeout(connectionTimeout);
        console.log('WebSocket closed:', {
          code: event.code,
          reason: event.reason,
          wasClean: event.wasClean
        });
        
        setWsStatus(`Closed: ${event.code}`);
        setIsConnecting(false);
        
        if (!event.wasClean) {
          setError(`Connection closed abnormally (${event.code})`);
        }
      };

      ws.onerror = (event) => {
        clearTimeout(connectionTimeout);
        console.error('WebSocket error:', event);
        setWsStatus('Connection error');
        setError('Failed to establish connection');
        setIsConnecting(false);
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
    }
  }, [baseUrl, anonKey, isConnecting]);

  return (
    <div className="p-4 border rounded-lg shadow-sm bg-white">
      <h2 className="text-xl font-bold mb-4">Connection Diagnostics</h2>
      
      <div className="space-y-4">
        <div className="flex items-center">
          <button 
            onClick={testHTTP}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mr-2 transition-colors"
          >
            Test HTTP
          </button>
          <span className="ml-2 font-mono text-sm">{httpStatus}</span>
        </div>

        <div className="flex items-center">
          <button 
            onClick={testWebSocket}
            disabled={isConnecting}
            className={`${
              isConnecting ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600'
            } text-white px-4 py-2 rounded mr-2 transition-colors`}
          >
            {isConnecting ? 'Connecting...' : 'Test WebSocket'}
          </button>
          <span className="ml-2 font-mono text-sm">{wsStatus}</span>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded text-red-700 text-sm">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConnectionTest;