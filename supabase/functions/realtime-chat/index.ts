import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
}

const activeConnections = new Set();

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const upgrade = req.headers.get('upgrade') || ''
    if (upgrade.toLowerCase() !== 'websocket') {
      return new Response('Expected WebSocket upgrade', { 
        status: 426,
        headers: corsHeaders
      })
    }

    console.log('WebSocket connection attempt received')

    // Create WebSocket connection
    const { socket, response } = Deno.upgradeWebSocket(req)
    
    // Add connection to active set
    activeConnections.add(socket);
    
    socket.onopen = () => {
      console.log('WebSocket connection opened')
      // Send initial connection confirmation
      socket.send(JSON.stringify({
        type: 'connection.established',
        timestamp: new Date().toISOString()
      }))

      // Start heartbeat
      const heartbeatInterval = setInterval(() => {
        if (socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify({
            type: 'heartbeat',
            timestamp: new Date().toISOString()
          }))
        } else {
          clearInterval(heartbeatInterval);
        }
      }, 30000); // Send heartbeat every 30 seconds
    }

    socket.onmessage = async (event) => {
      console.log('Message received:', event.data)
      
      try {
        const message = JSON.parse(event.data)
        
        // Handle different message types
        switch (message.type) {
          case 'ping':
            socket.send(JSON.stringify({
              type: 'pong',
              timestamp: new Date().toISOString()
            }));
            break;
          
          case 'message':
            // Echo back the message for now
            socket.send(JSON.stringify({
              type: 'message.echo',
              data: message,
              timestamp: new Date().toISOString()
            }));
            break;
            
          default:
            console.log('Unknown message type:', message.type);
        }
      } catch (err) {
        console.error('Error processing message:', err)
        socket.send(JSON.stringify({
          type: 'error',
          error: 'Failed to process message',
          timestamp: new Date().toISOString()
        }))
      }
    }

    socket.onerror = (error) => {
      console.error('WebSocket error:', error)
      activeConnections.delete(socket);
    }

    socket.onclose = () => {
      console.log('WebSocket connection closed')
      activeConnections.delete(socket);
    }

    // Add CORS headers to the upgrade response
    const responseHeaders = new Headers(response.headers)
    for (const [key, value] of Object.entries(corsHeaders)) {
      responseHeaders.set(key, value)
    }

    return new Response(null, {
      status: 101,
      headers: responseHeaders
    })

  } catch (error) {
    console.error('Server error:', error)
    return new Response(JSON.stringify({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : String(error)
    }), {
      status: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    })
  }
})