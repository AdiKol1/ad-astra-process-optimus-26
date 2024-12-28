import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
}

interface WebSocketConnection extends WebSocket {
  heartbeatInterval?: number;
}

const activeConnections = new Set<WebSocketConnection>();

serve(async (req) => {
  try {
    if (req.method === 'OPTIONS') {
      return new Response('ok', { headers: corsHeaders })
    }

    const upgrade = req.headers.get('upgrade') || ''
    if (upgrade.toLowerCase() !== 'websocket') {
      console.log('Request is not a WebSocket upgrade')
      return new Response('Expected WebSocket upgrade', { 
        status: 426,
        headers: corsHeaders
      })
    }

    console.log('WebSocket upgrade request received')

    const { socket: rawSocket, response } = Deno.upgradeWebSocket(req)
    const socket = rawSocket as WebSocketConnection;
    
    activeConnections.add(socket);
    console.log(`Active connections: ${activeConnections.size}`)
    
    socket.onopen = () => {
      console.log('WebSocket connection opened')
      
      socket.send(JSON.stringify({
        type: 'connection.established',
        timestamp: new Date().toISOString()
      }))

      socket.heartbeatInterval = setInterval(() => {
        if (socket.readyState === WebSocket.OPEN) {
          try {
            socket.send(JSON.stringify({
              type: 'heartbeat',
              timestamp: new Date().toISOString()
            }))
            console.log('Heartbeat sent')
          } catch (error) {
            console.error('Error sending heartbeat:', error)
            if (socket.heartbeatInterval) {
              clearInterval(socket.heartbeatInterval)
            }
          }
        } else {
          console.log('Clearing heartbeat - socket not open')
          if (socket.heartbeatInterval) {
            clearInterval(socket.heartbeatInterval)
          }
        }
      }, 30000)
    }

    socket.onmessage = async (event) => {
      console.log('Message received:', event.data)
      
      try {
        const message = JSON.parse(event.data)
        
        switch (message.type) {
          case 'ping':
            socket.send(JSON.stringify({
              type: 'pong',
              timestamp: new Date().toISOString()
            }))
            console.log('Ping-Pong completed')
            break;
          
          case 'message':
            socket.send(JSON.stringify({
              type: 'message.echo',
              data: message,
              timestamp: new Date().toISOString()
            }))
            console.log('Message echoed back')
            break;
            
          default:
            console.log('Unknown message type:', message.type)
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
      activeConnections.delete(socket)
      if (socket.heartbeatInterval) {
        clearInterval(socket.heartbeatInterval)
      }
      console.log(`Connection removed. Active connections: ${activeConnections.size}`)
    }

    socket.onclose = () => {
      console.log('WebSocket connection closed')
      activeConnections.delete(socket)
      if (socket.heartbeatInterval) {
        clearInterval(socket.heartbeatInterval)
      }
      console.log(`Connection removed. Active connections: ${activeConnections.size}`)
    }

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