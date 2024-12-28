import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  const requestId = crypto.randomUUID();
  console.log(`[${requestId}] New request received`);

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const upgrade = req.headers.get('upgrade') || '';
    if (upgrade.toLowerCase() !== 'websocket') {
      return new Response('Expected WebSocket upgrade', { 
        status: 426,
        headers: {
          ...corsHeaders,
          'Upgrade': 'websocket'
        }
      });
    }

    const { socket, response } = Deno.upgradeWebSocket(req);
    
    // Add CORS headers to upgrade response
    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    socket.onopen = () => {
      console.log(`[${requestId}] WebSocket connection opened`);
      socket.send(JSON.stringify({
        type: 'connection.established',
        requestId,
        timestamp: new Date().toISOString()
      }));
    };

    socket.onmessage = async (event) => {
      console.log(`[${requestId}] Message received:`, event.data);
      
      try {
        const message = JSON.parse(event.data);
        
        // Echo back the message for now
        socket.send(JSON.stringify({
          type: 'message.echo',
          data: message,
          requestId,
          timestamp: new Date().toISOString()
        }));
      } catch (err) {
        console.error(`[${requestId}] Error processing message:`, err);
        socket.send(JSON.stringify({
          type: 'error',
          error: 'Failed to process message',
          requestId,
          timestamp: new Date().toISOString()
        }));
      }
    };

    socket.onerror = (error) => {
      console.error(`[${requestId}] WebSocket error:`, error);
    };

    socket.onclose = () => {
      console.log(`[${requestId}] WebSocket connection closed`);
    };

    return response;

  } catch (error) {
    console.error(`[${requestId}] Server error:`, error);
    return new Response(JSON.stringify({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : String(error)
    }), {
      status: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  }
});