import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight');
    return new Response(null, { 
      headers: { 
        ...corsHeaders,
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      }
    });
  }

  // Handle HTTP health check
  if (req.method === 'GET') {
    console.log('Handling health check');
    const response = {
      status: 'healthy',
      timestamp: new Date().toISOString()
    };
    return new Response(JSON.stringify(response), { 
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json'
      } 
    });
  }

  const upgrade = req.headers.get('upgrade') || '';
  if (upgrade.toLowerCase() !== 'websocket') {
    console.error('Not a WebSocket upgrade request');
    return new Response('Expected WebSocket upgrade', { 
      status: 426,
      headers: { ...corsHeaders }
    });
  }

  try {
    console.log('Processing WebSocket upgrade request');
    const { socket, response } = Deno.upgradeWebSocket(req);

    socket.onopen = () => {
      console.log('Client WebSocket opened');
      socket.send(JSON.stringify({ 
        type: 'connection.success',
        timestamp: Date.now()
      }));
    };

    socket.onmessage = async (event) => {
      console.log('Received message:', event.data);
      try {
        const data = JSON.parse(event.data);
        
        // Echo the message back for testing
        socket.send(JSON.stringify({
          type: 'message.received',
          data,
          timestamp: Date.now()
        }));

      } catch (error) {
        console.error('Error processing message:', error);
        socket.send(JSON.stringify({
          type: 'error',
          error: 'Failed to process message',
          timestamp: Date.now()
        }));
      }
    };

    socket.onerror = (event) => {
      console.error('WebSocket error:', event);
    };

    socket.onclose = (event) => {
      console.log('WebSocket closed:', {
        code: event.code,
        reason: event.reason || 'No reason provided',
        wasClean: event.wasClean
      });
    };

    // Add CORS headers to the upgrade response
    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;

  } catch (error) {
    console.error('Error handling WebSocket:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to establish WebSocket connection' }), 
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});