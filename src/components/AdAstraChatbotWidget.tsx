import React, { useState, useRef, useEffect } from 'react';
import { AI_CONFIG } from '@/utils/aiConfig';
import { useToast } from '@/hooks/use-toast';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const API_URL = "/api/chat";

export default function AdAstraChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'system', content: AI_CONFIG.openai.systemPrompt }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (messagesEndRef.current && typeof messagesEndRef.current.scrollIntoView === 'function') {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to get response');
      }

      const data = await res.json();
      const assistantMsg = data.choices?.[0]?.message?.content || data.content || 'Sorry, I had trouble responding.';
      setMessages([...newMessages, { role: 'assistant', content: assistantMsg }]);
    } catch (err) {
      console.error('Chat error:', err);
      toast({
        title: "Error",
        description: 'Failed to send message. Please try again.',
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Chat Icon */}
      <button
        onClick={() => setOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 z-50",
          "w-14 h-14 rounded-full bg-primary hover:bg-primary/90",
          "flex items-center justify-center",
          "shadow-lg transition-all duration-200",
          "hover:scale-105 active:scale-95"
        )}
        aria-label="Open Ad Astra Chatbot"
      >
        <MessageCircle className="w-6 h-6 text-primary-foreground" />
      </button>

      {/* Modal */}
      {open && (
        <div
          className={cn(
            "fixed bottom-24 right-6 z-50 w-[360px] max-w-[90vw] h-[500px] max-h-[80vh]",
            "bg-white rounded-xl shadow-2xl flex flex-col border border-gray-200 animate-in fade-in zoom-in duration-200"
          )}
          style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.18)' }}
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-4 border-b bg-primary text-primary-foreground flex justify-between items-center rounded-t-xl">
            <h3 className="font-semibold text-lg">Chat with Ad Astra AI</h3>
            <button
              onClick={() => setOpen(false)}
              className="p-1 hover:bg-primary/80 rounded-full transition-colors"
              aria-label="Close chatbot"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background">
            {messages.filter(m => m.role !== 'system').map((msg, i) => (
              <div
                key={i}
                className={cn(
                  "flex",
                  msg.role === 'user' ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl p-3",
                    msg.role === 'user'
                      ? "bg-primary text-primary-foreground"
                      : "bg-background text-primary border border-primary"
                  )}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {msg.content}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
            {loading && (
              <div className="flex justify-center">
                <Loader2 className="w-5 h-5 text-primary animate-spin" />
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t bg-gray-50 flex gap-2 rounded-b-xl">
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your question..."
              rows={1}
              className={cn(
                "flex-1 resize-none rounded-lg border border-primary",
                "px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary",
                "min-h-[40px] max-h-[120px]",
                loading && "opacity-50 cursor-not-allowed"
              )}
              disabled={loading}
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className={cn(
                "px-4 rounded-lg font-medium text-sm",
                "bg-primary hover:bg-primary/90 text-primary-foreground",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "transition-colors duration-200"
              )}
              aria-label="Send message"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      )}
    </>
  );
} 