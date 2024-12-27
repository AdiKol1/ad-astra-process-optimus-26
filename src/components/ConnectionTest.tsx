import { HttpTest } from './connection/HttpTest';
import { WebSocketTest } from './connection/WebSocketTest';
import { SUPABASE_PUBLISHABLE_KEY } from '@/integrations/supabase/client';
import { supabase } from '@/integrations/supabase/client';
import { useEffect, useState } from 'react';

const ConnectionTest = () => {
  const baseUrl = 'gjkagdysjgljjbnagoib.supabase.co';
  const anonKey = SUPABASE_PUBLISHABLE_KEY;
  const [dbTestResult, setDbTestResult] = useState<string>('Not tested');

  useEffect(() => {
    const testDatabaseConnection = async () => {
      try {
        console.log('Testing database connection...');
        const { data, error } = await supabase
          .from('chat_messages')
          .select('*')
          .limit(1);

        if (error) {
          console.error('Database test error:', error);
          setDbTestResult(`Error: ${error.message}`);
        } else {
          console.log('Database test successful:', data);
          setDbTestResult('Success: Database connection working');
        }
      } catch (err) {
        console.error('Database test caught error:', err);
        setDbTestResult(`Error: ${err instanceof Error ? err.message : String(err)}`);
      }
    };

    testDatabaseConnection();
  }, []);

  if (!anonKey) {
    return (
      <div className="p-4 border rounded-lg shadow-sm bg-white">
        <h2 className="text-xl font-bold mb-4">Connection Diagnostics</h2>
        <div className="text-red-600">
          Error: Supabase anon key is not configured
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 border rounded-lg shadow-sm bg-white">
      <h2 className="text-xl font-bold mb-4">Connection Diagnostics</h2>
      
      <div className="space-y-4">
        <div className="flex flex-col gap-2">
          <div className="font-semibold">Database Connection:</div>
          <div className="font-mono text-sm">{dbTestResult}</div>
        </div>
        <HttpTest baseUrl={baseUrl} anonKey={anonKey} />
        <WebSocketTest baseUrl={baseUrl} anonKey={anonKey} />
      </div>
    </div>
  );
};

export default ConnectionTest;