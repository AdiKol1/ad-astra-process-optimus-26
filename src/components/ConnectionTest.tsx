import { HttpTest } from './connection/HttpTest';
import { WebSocketTest } from './connection/WebSocketTest';

const ConnectionTest = () => {
  const baseUrl = 'gjkagdysjgljjbnagoib.supabase.co';
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

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