import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')!;
const OPENAI_API_URL = 'wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-10-01';

serve(async (req) => {
  if (req.method === 'GET') {
    const url = new URL(req.url);
    const upgrade = req.headers.get("upgrade") || "";
    
    if (upgrade.toLowerCase() != "websocket") {
      return new Response("Expected websocket", { status: 400 });
    }

    const { socket: clientWs, response } = Deno.upgradeWebSocket(req);
    let openaiWs: WebSocket | null = null;

    try {
      openaiWs = new WebSocket(OPENAI_API_URL);
      
      openaiWs.onopen = () => {
        console.log("Connected to OpenAI");
        clientWs.send(JSON.stringify({ type: "connection.success" }));
      };

      openaiWs.onmessage = (event) => {
        clientWs.send(event.data);
      };

      openaiWs.onerror = (error) => {
        console.error("OpenAI WebSocket error:", error);
        clientWs.send(JSON.stringify({ 
          type: "error", 
          error: "Connection to AI service failed" 
        }));
      };

      clientWs.onmessage = async (event) => {
        if (openaiWs?.readyState === WebSocket.OPEN) {
          openaiWs.send(event.data);
        }
      };

      clientWs.onclose = () => {
        console.log("Client disconnected");
        openaiWs?.close();
      };

    } catch (err) {
      console.error("Error in realtime-chat function:", err);
      return new Response(JSON.stringify({ error: err.message }), { 
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }

    return response;
  }

  return new Response("Method not allowed", { status: 405 });
});