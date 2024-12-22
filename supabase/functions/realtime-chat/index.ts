import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')!;
const OPENAI_API_URL = 'wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-10-01';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const upgrade = req.headers.get("upgrade") || "";
  if (upgrade.toLowerCase() != "websocket") {
    return new Response("Expected websocket", { status: 400 });
  }

  try {
    const { socket: clientWs, response } = Deno.upgradeWebSocket(req);
    let openaiWs: WebSocket | null = null;

    clientWs.onopen = () => {
      console.log("Client connected");
      
      // Connect to OpenAI
      openaiWs = new WebSocket(OPENAI_API_URL, [
        'realtime',
        `openai-insecure-api-key.${OPENAI_API_KEY}`,
        'openai-beta.realtime-v1',
      ]);
      
      openaiWs.onopen = () => {
        console.log("Connected to OpenAI");
        clientWs.send(JSON.stringify({ type: "connection.success" }));
      };

      openaiWs.onmessage = (event) => {
        console.log("Received from OpenAI:", event.data);
        clientWs.send(event.data);
      };

      openaiWs.onerror = (error) => {
        console.error("OpenAI WebSocket error:", error);
        clientWs.send(JSON.stringify({ 
          type: "error", 
          error: "Connection to AI service failed" 
        }));
      };
    };

    clientWs.onmessage = async (event) => {
      console.log("Received from client:", event.data);
      if (openaiWs?.readyState === WebSocket.OPEN) {
        openaiWs.send(event.data);
      }
    };

    clientWs.onclose = () => {
      console.log("Client disconnected");
      openaiWs?.close();
    };

    clientWs.onerror = (error) => {
      console.error("Client WebSocket error:", error);
    };

    return response;
  } catch (err) {
    console.error("Error in realtime-chat function:", err);
    return new Response(JSON.stringify({ error: err.message }), { 
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});