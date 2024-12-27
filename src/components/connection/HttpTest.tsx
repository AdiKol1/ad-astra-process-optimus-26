import { useState } from 'react';
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

interface HttpTestProps {
  baseUrl: string;
  anonKey: string;
}

export const HttpTest = ({ baseUrl, anonKey }: HttpTestProps) => {
  const [status, setStatus] = useState<string>('Not tested');

  const testConnection = async () => {
    try {
      setStatus('Testing...');
      const testUrl = `https://${baseUrl}/functions/v1/realtime-chat`;
      console.log('Testing HTTP connection:', testUrl);
      
      const response = await fetch(testUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${anonKey}`
        }
      });

      // Log headers for debugging
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      
      // Clone response before reading body
      const responseClone = response.clone();
      const text = await responseClone.text();
      console.log('Response text:', text);

      try {
        const data = JSON.parse(text);
        setStatus(`Success (${response.status}): ${JSON.stringify(data)}`);
        toast({
          title: "HTTP Test Successful",
          description: `Status: ${response.status}`,
        });
      } catch (parseError) {
        setStatus(`Response (${response.status}): ${text}`);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error('HTTP Test Error:', errorMessage);
      setStatus(`Failed: ${errorMessage}`);
      toast({
        title: "HTTP Test Failed",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="flex items-center">
      <Button 
        onClick={testConnection}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mr-2 transition-colors"
      >
        Test HTTP
      </Button>
      <span className="ml-2 font-mono text-sm">{status}</span>
    </div>
  );
};