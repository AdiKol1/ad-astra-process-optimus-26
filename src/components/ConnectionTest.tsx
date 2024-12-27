import { useState } from 'react';

const ConnectionTest = () => {
  const [httpStatus, setHttpStatus] = useState<string>('Not tested');
  const [wsStatus, setWsStatus] = useState<string>('Not tested');
  const [error, setError] = useState<string | null>(null);
  
  const baseUrl = 'gjkagdysjgljjbnagoib.functions.supabase.co/functions/v1/realtime-chat';

  const testHTTP = async () => {
    try {
      setHttpStatus('Testing...');
      console.log('Testing HTTP connection to:', `https://${baseUrl}`);
      
      const response = await fetch(`https://${baseUrl}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      // Create a clone of the response before reading it
      const responseClone = response.clone();
      
      // Log raw response details for debugging
      console.log('HTTP Response:', {
        status: responseClone.status,
        statusText: responseClone.statusText,
        headers: Object.fromEntries(responseClone.headers.entries())
      });

      // Read the response text from the original response
      const responseText = await response.text();
      console.log('Response text:', responseText);
      
      try {
        const data = JSON.parse(responseText);
        setHttpStatus(`HTTP ${response.status}: ${JSON.stringify(data)}`);
      } catch {
        setHttpStatus(`HTTP ${response.status}: ${responseText}`);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error('HTTP Test Error:', errorMessage);
      setHttpStatus(`HTTP Failed: ${errorMessage}`);
    }
  };

  const testWebSocket = () => {
    try {
      setWsStatus('Connecting...');
      setError(null);
      
      const wsUrl = `wss://${baseUrl}`;
      console.log('Attempting WebSocket connection to:', wsUrl);
      
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log('WebSocket Connected');
        setWsStatus('WebSocket Connected');
        
        // Send a test message
        const testMessage = {
          type: 'ping',
          timestamp: Date.now()
        };
        console.log('Sending test message:', testMessage);
        ws.send(JSON.stringify(testMessage));
      };

      ws.onmessage = (event) => {
        console.log('WebSocket Message Received:', event.data);
        try {
          const data = JSON.parse(event.data);
          setWsStatus(`Message Received: ${JSON.stringify(data)}`);
        } catch (err) {
          console.error('Error parsing WebSocket message:', err);
        }
      };

      ws.onclose = (event) => {
        const details = {
          code: event.code,
          reason: event.reason || 'No reason provided',
          wasClean: event.wasClean
        };
        console.log('WebSocket Closed:', details);
        setWsStatus(`WebSocket Closed: ${event.code} ${details.reason}`);
        if (event.code !== 1000) {
          setError(`Connection closed: ${details.reason} (Code: ${event.code})`);
        }
      };

      ws.onerror = (event) => {
        console.error('WebSocket Error:', event);
        setWsStatus('WebSocket Error: Connection failed');
        setError('Failed to establish WebSocket connection');
      };

      // Clean up function
      return () => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.close(1000, 'Test completed');
        }
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error('WebSocket Setup Error:', errorMessage);
      setError(errorMessage);
    }
  };

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
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded mr-2 transition-colors"
          >
            Test WebSocket
          </button>
          <span className="ml-2 font-mono text-sm">{wsStatus}</span>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded text-red-700 text-sm">
            Error: {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConnectionTest;