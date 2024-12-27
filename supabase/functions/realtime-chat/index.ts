import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  const requestId = crypto.randomUUID();
  console.log(`[${requestId}] Request received:`, {
    method: req.method,
    url: req.url,
    headers: Object.fromEntries(req.headers.entries())
  });

  try {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
      console.log(`[${requestId}] Handling CORS preflight`);
      return new Response(null, { headers: corsHeaders });
    }

    // Handle WebSocket upgrade
    const upgrade = req.headers.get('upgrade') || '';
    if (upgrade.toLowerCase() != 'websocket') {
      console.log(`[${requestId}] Not a WebSocket upgrade request`);
      return new Response('Expected WebSocket upgrade', { 
        status: 426,
        headers: corsHeaders
      });
    }

    const { socket, response } = Deno.upgradeWebSocket(req);
    console.log(`[${requestId}] WebSocket upgrade successful`);
    
    // Add CORS headers to the upgrade response
    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    socket.onopen = () => {
      console.log(`[${requestId}] WebSocket connection opened`);
      socket.send(JSON.stringify({
        type: 'connection.established',
        timestamp: Date.now(),
        requestId
      }));
    };

    socket.onmessage = async (event) => {
      console.log(`[${requestId}] Message received:`, event.data);
      try {
        const data = JSON.parse(event.data);
        
        switch (data.type) {
          case 'text':
            socket.send(JSON.stringify({
              type: 'text.response',
              content: `Echo: ${data.content}`,
              timestamp: Date.now(),
              requestId
            }));
            break;
            
          case 'voice':
            socket.send(JSON.stringify({
              type: 'voice.response',
              content: 'Voice message received',
              timestamp: Date.now(),
              requestId
            }));
            break;
            
          case 'connection.initialize':
            socket.send(JSON.stringify({
              type: 'connection.confirmed',
              timestamp: Date.now(),
              requestId
            }));
            break;
            
          default:
            console.log(`[${requestId}] Unknown message type:`, data.type);
        }
      } catch (error) {
        console.error(`[${requestId}] Error processing message:`, error);
        socket.send(JSON.stringify({
          type: 'error',
          error: 'Failed to process message',
          timestamp: Date.now(),
          requestId
        }));
      }
    };

    socket.onerror = (e) => {
      console.error(`[${requestId}] WebSocket error:`, e);
    };

    socket.onclose = () => {
      console.log(`[${requestId}] WebSocket connection closed`);
    };

    return response;

  } catch (error) {
    console.error(`[${requestId}] Error handling request:`, error);
    return new Response(JSON.stringify({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : String(error),
      requestId
    }), {
      status: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  }
});