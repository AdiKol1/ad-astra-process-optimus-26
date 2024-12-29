import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface HttpTestProps {
  baseUrl: string;
  anonKey: string;
}

export const HttpTest = ({ baseUrl, anonKey }: HttpTestProps) => {
  const [status, setStatus] = useState<string>('Not tested');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const testConnection = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    setError(null);
    setStatus('Testing...');

    try {
      if (!anonKey) {
        throw new Error('Supabase anon key is not configured');
      }

      const url = `https://${baseUrl}/functions/v1/realtime-chat`;
      console.log('Testing HTTP connection:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${anonKey}`,
          'apikey': anonKey
        }
      });

      // Store status before reading the body
      const statusCode = response.status;
      const statusText = response.statusText;
      
      // Read the response text once and store it
      const responseText = await response.text();
      console.log('HTTP response received:', {
        status: statusCode,
        text: responseText
      });

      if (!response.ok) {
        // Use the stored status and response text
        throw new Error(`HTTP ${statusCode} ${statusText}: ${responseText}`);
      }

      setStatus(`Success: ${statusCode}`);
      console.log('HTTP test successful');

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error('HTTP Test Error:', errorMessage);
      setError(errorMessage);
      setStatus('Failed');
      toast({
        title: "HTTP Connection Failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center">
        <Button 
          onClick={testConnection}
          disabled={isLoading}
          className={`${
            isLoading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
          } text-white px-4 py-2 rounded mr-2 transition-colors`}
        >
          {isLoading ? 'Testing...' : 'Test HTTP'}
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