import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

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
        headers: {
          ...corsHeaders,
          'Upgrade': 'websocket'
        }
      })
    }

    // Get auth token from URL params since WebSocket doesn't support custom headers
    const url = new URL(req.url)
    const token = url.searchParams.get('token')

    // Validate authentication if token provided
    if (token) {
      const { data: { user }, error } = await supabase.auth.getUser(token)
      if (error || !user) {
        return new Response('Unauthorized', { 
          status: 401,
          headers: corsHeaders
        })
      }
    }

    // Upgrade the connection to WebSocket
    const { socket, response } = Deno.upgradeWebSocket(req)
    
    // Add CORS headers to upgrade response
    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.set(key, value)
    })

    socket.onopen = () => {
      console.log('WebSocket connection opened')
      socket.send(JSON.stringify({
        type: 'connection.established',
        timestamp: new Date().toISOString()
      }))
    }

    socket.onmessage = async (event) => {
      console.log('Message received:', event.data)
      
      try {
        const message = JSON.parse(event.data)
        
        // Echo back the message for now
        socket.send(JSON.stringify({
          type: 'message.echo',
          data: message,
          timestamp: new Date().toISOString()
        }))
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
    }

    socket.onclose = () => {
      console.log('WebSocket connection closed')
    }

    return response

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