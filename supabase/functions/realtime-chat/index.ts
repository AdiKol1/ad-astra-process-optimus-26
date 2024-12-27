import "https://deno.land/x/xhr@0.1.0/mod.ts"
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log('Received request:', {
    url: req.url,
    method: req.method,
    headers: Object.fromEntries(req.headers.entries())
  });

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight request');
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Checking for WebSocket upgrade');
    const upgrade = req.headers.get('upgrade') || '';
    if (upgrade.toLowerCase() !== 'websocket') {
      console.error('Not a WebSocket upgrade request');
      return new Response('Expected WebSocket upgrade', { 
        status: 426,
        headers: corsHeaders
      });
    }

    console.log('Upgrading connection to WebSocket');
    const { socket: clientWs, response } = Deno.upgradeWebSocket(req);
    let openaiWs: WebSocket | null = null;

    clientWs.onopen = () => {
      console.log('Client WebSocket opened');
      
      // Connect to OpenAI's realtime API
      console.log('Connecting to OpenAI WebSocket');
      openaiWs = new WebSocket('wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-10-01', [
        'realtime',
        `openai-insecure-api-key.${OPENAI_API_KEY}`,
        'openai-beta.realtime-v1',
      ]);
      
      openaiWs.onopen = () => {
        console.log('OpenAI WebSocket opened successfully');
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
        console.error('OpenAI WebSocket not ready, state:', openaiWs?.readyState);
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