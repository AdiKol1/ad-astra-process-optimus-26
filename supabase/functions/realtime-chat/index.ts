import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')!;
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Received request:', req.url);
    
    const upgrade = req.headers.get('upgrade') || '';
    if (upgrade.toLowerCase() !== 'websocket') {
      console.error('Not a WebSocket upgrade request');
      return new Response('Expected WebSocket upgrade', { 
        status: 426,
        headers: corsHeaders
      });
    }

    const url = new URL(req.url);
    const jwt = url.searchParams.get('jwt');
    if (!jwt) {
      console.error('No JWT token provided');
      return new Response('Authentication required', { 
        status: 401,
        headers: corsHeaders
      });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(jwt);
    if (authError || !user) {
      console.error('Invalid JWT token:', authError);
      return new Response('Invalid authentication token', { 
        status: 401,
        headers: corsHeaders
      });
    }

    console.log('User authenticated:', user.id);

    const { socket: clientWs, response } = Deno.upgradeWebSocket(req);
    let openaiWs: WebSocket | null = null;

    clientWs.onopen = () => {
      console.log('Client WebSocket opened');
      
      openaiWs = new WebSocket('wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-10-01', [
        'realtime',
        `openai-insecure-api-key.${OPENAI_API_KEY}`,
        'openai-beta.realtime-v1',
      ]);
      
      openaiWs.onopen = () => {
        console.log('OpenAI WebSocket opened');
        clientWs.send(JSON.stringify({ type: "connection.success" }));
      };

      openaiWs.onmessage = (event) => {
        console.log('OpenAI message received:', event.data);
        clientWs.send(event.data);
      };

      openaiWs.onerror = (error) => {
        console.error('OpenAI WebSocket error:', error);
        clientWs.send(JSON.stringify({ 
          type: "error", 
          error: "OpenAI connection error" 
        }));
      };

      openaiWs.onclose = () => {
        console.log('OpenAI WebSocket closed');
        clientWs.send(JSON.stringify({ 
          type: "error", 
          error: "OpenAI connection closed" 
        }));
      };
    };

    clientWs.onmessage = (event) => {
      console.log('Client message received:', event.data);
      if (openaiWs?.readyState === WebSocket.OPEN) {
        openaiWs.send(event.data);
      } else {
        clientWs.send(JSON.stringify({ 
          type: "error", 
          error: "OpenAI connection not ready" 
        }));
      }
    };

    clientWs.onclose = () => {
      console.log('Client WebSocket closed');
      openaiWs?.close();
    };

    clientWs.onerror = (error) => {
      console.error('Client WebSocket error:', error);
    };

    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;
  } catch (err) {
    console.error('WebSocket setup error:', err);
    return new Response(JSON.stringify({ error: err.message }), { 
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});