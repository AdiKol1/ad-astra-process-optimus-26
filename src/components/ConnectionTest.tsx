import { HttpTest } from './connection/HttpTest';
import { WebSocketTest } from './connection/WebSocketTest';
import { SUPABASE_PUBLISHABLE_KEY } from '@/integrations/supabase/client';

const ConnectionTest = () => {
  const baseUrl = 'gjkagdysjgljjbnagoib.supabase.co';
  const anonKey = SUPABASE_PUBLISHABLE_KEY;

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
        <HttpTest baseUrl={baseUrl} anonKey={anonKey} />
        <WebSocketTest baseUrl={baseUrl} anonKey={anonKey} />
      </div>
    </div>
  );
};

export default ConnectionTest;