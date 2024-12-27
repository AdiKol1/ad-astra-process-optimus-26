import "https://deno.land/x/xhr@0.1.0/mod.ts"
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Helper function to establish OpenAI connection first
const connectToOpenAI = () => {
  return new Promise((resolve, reject) => {
    console.log('Attempting to connect to OpenAI...')
    const ws = new WebSocket('wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-10-01', [
      'realtime',
      `openai-insecure-api-key.${OPENAI_API_KEY}`,
      'openai-beta.realtime-v1',
    ])

    // Set a connection timeout
    const timeout = setTimeout(() => {
      ws.close()
      reject(new Error('OpenAI connection timeout'))
    }, 10000)

    ws.onopen = () => {
      console.log('OpenAI connection established')
      clearTimeout(timeout)
      resolve(ws)
    }

    ws.onerror = (error) => {
      console.error('OpenAI connection error:', error)
      clearTimeout(timeout)
      reject(error)
    }

    ws.onclose = (event) => {
      console.log('OpenAI connection attempt closed:', {
        code: event.code,
        reason: event.reason,
        wasClean: event.wasClean
      })
      clearTimeout(timeout)
      if (!event.wasClean) {
        reject(new Error(`OpenAI connection closed: ${event.reason || 'Unknown reason'}`))
      }
    }
  })
}

serve(async (req) => {
  console.log('Incoming request:', {
    method: req.method,
    url: req.url,
    headers: Object.fromEntries(req.headers.entries())
  })

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight')
    return new Response(null, { headers: corsHeaders })
  }

  const upgrade = req.headers.get('upgrade') || ''
  if (upgrade.toLowerCase() !== 'websocket') {
    console.error('Not a WebSocket upgrade request')
    return new Response('Expected WebSocket upgrade', { 
      status: 426,
      headers: corsHeaders
    })
  }

  if (!OPENAI_API_KEY) {
    console.error('OpenAI API key not configured')
    return new Response('Server configuration error', { 
      status: 500,
      headers: corsHeaders
    })
  }

  try {
    // First establish OpenAI connection
    const openaiWs = await connectToOpenAI() as WebSocket
    console.log('OpenAI connection successful, upgrading client connection')

    // Only upgrade client connection after OpenAI connection is confirmed
    const { socket: clientWs, response } = Deno.upgradeWebSocket(req)
    
    clientWs.onopen = () => {
      console.log('Client WebSocket opened')
      clientWs.send(JSON.stringify({ type: "connection.success" }))
    }

    clientWs.onmessage = (event) => {
      console.log('Client message received:', event.data)
      if (openaiWs.readyState === WebSocket.OPEN) {
        openaiWs.send(event.data)
      } else {
        console.error('OpenAI WebSocket not ready, state:', openaiWs.readyState)
        clientWs.send(JSON.stringify({ 
          type: "error", 
          error: "OpenAI connection not ready" 
        }))
      }
    }

    clientWs.onclose = (event) => {
      console.log('Client WebSocket closed:', {
        code: event.code,
        reason: event.reason,
        wasClean: event.wasClean
      })
      openaiWs.close()
    }

    clientWs.onerror = (error) => {
      console.error('Client WebSocket error:', error)
    }

    // Set up OpenAI message handlers
    openaiWs.onmessage = (event) => {
      console.log('OpenAI message:', event.data)
      if (clientWs.readyState === WebSocket.OPEN) {
        clientWs.send(event.data)
      }
    }

    openaiWs.onerror = (error) => {
      console.error('OpenAI WebSocket error:', error)
      clientWs.send(JSON.stringify({ 
        type: "error", 
        error: "OpenAI connection error" 
      }))
    }

    openaiWs.onclose = (event) => {
      console.log('OpenAI WebSocket closed:', {
        code: event.code,
        reason: event.reason,
        wasClean: event.wasClean
      })
      clientWs.send(JSON.stringify({ 
        type: "error", 
        error: "OpenAI connection closed" 
      }))
    }

    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.set(key, value)
    })

    return response

  } catch (err) {
    console.error('WebSocket setup error:', err)
    return new Response(JSON.stringify({ error: err.message }), { 
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})