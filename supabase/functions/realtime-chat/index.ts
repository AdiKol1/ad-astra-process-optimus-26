import "https://deno.land/x/xhr@0.1.0/mod.ts"
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  console.log('Incoming request:', {
    method: req.method,
    url: req.url,
    headers: Object.fromEntries(req.headers.entries())
  })

  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight')
    return new Response(null, { 
      headers: {
        ...corsHeaders,
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      }
    })
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
    const { socket: clientWs, response } = Deno.upgradeWebSocket(req)
    let openaiWs: WebSocket | null = null
    let sessionConfigured = false

    clientWs.onopen = () => {
      console.log('Client WebSocket opened')
      
      openaiWs = new WebSocket('wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-10-01', [
        'realtime',
        `openai-insecure-api-key.${OPENAI_API_KEY}`,
        'openai-beta.realtime-v1',
      ])
      
      openaiWs.onopen = () => {
        console.log('OpenAI WebSocket opened successfully')
        clientWs.send(JSON.stringify({ type: "connection.success" }))

        // Wait for session.created before sending session.update
        openaiWs.onmessage = (event) => {
          console.log('OpenAI message:', event.data)
          const data = JSON.parse(event.data)
          
          if (data.type === 'session.created' && !sessionConfigured) {
            console.log('Configuring session after session.created')
            sessionConfigured = true
            openaiWs?.send(JSON.stringify({
              type: "session.update",
              session: {
                modalities: ["text", "audio"],
                instructions: "You are a helpful AI assistant focused on helping users understand and optimize their business processes.",
                voice: "alloy",
                input_audio_format: "pcm16",
                output_audio_format: "pcm16",
                input_audio_transcription: {
                  model: "whisper-1"
                },
                turn_detection: {
                  type: "server_vad",
                  threshold: 0.5,
                  prefix_padding_ms: 300,
                  silence_duration_ms: 1000
                },
                temperature: 0.7,
                max_response_output_tokens: "inf"
              }
            }))
          }
          
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
    }

    clientWs.onmessage = (event) => {
      console.log('Client message received:', event.data)
      if (openaiWs?.readyState === WebSocket.OPEN) {
        openaiWs.send(event.data)
      } else {
        console.error('OpenAI WebSocket not ready, state:', openaiWs?.readyState)
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
      openaiWs?.close()
    }

    clientWs.onerror = (error) => {
      console.error('Client WebSocket error:', error)
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