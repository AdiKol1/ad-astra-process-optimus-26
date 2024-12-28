import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-session-id',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
};

serve(async (req) => {
  const sessionId = crypto.randomUUID();
  console.log(`[${sessionId}] Request received:`, req.method);

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Handle WebSocket upgrade
  if (req.headers.get("upgrade") === "websocket") {
    const { socket, response } = Deno.upgradeWebSocket(req, {
      protocol: "chat",
      idleTimeout: 60 // seconds
    });

    socket.onopen = () => {
      console.log(`[${sessionId}] WebSocket connected`);
      socket.send(JSON.stringify({ 
        type: 'connected',
        sessionId,
        timestamp: Date.now()
      }));
    };

    socket.onmessage = async (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log(`[${sessionId}] Message received:`, data);

        // Echo back the message for testing
        socket.send(JSON.stringify({
          type: 'echo',
          data,
          timestamp: Date.now()
        }));
      } catch (error) {
        console.error(`[${sessionId}] Error processing message:`, error);
        socket.send(JSON.stringify({
          type: 'error',
          error: 'Failed to process message',
          timestamp: Date.now()
        }));
      }
    };

    socket.onerror = (error) => {
      console.error(`[${sessionId}] WebSocket error:`, error);
    };

    socket.onclose = () => {
      console.log(`[${sessionId}] WebSocket closed`);
    };

    // Add CORS headers to upgrade response
    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;
  }

  return new Response('Expected WebSocket upgrade', { 
    status: 426,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json'
    }
  });
});