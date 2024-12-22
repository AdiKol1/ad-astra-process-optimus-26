import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Send } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (text: string) => boolean;
  isRecording: boolean;
  onStartRecording: () => Promise<boolean>;
  onStopRecording: () => void;
  isConnected: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isRecording,
  onStartRecording,
  onStopRecording,
  isConnected
}) => {
  const [inputText, setInputText] = useState('');

  const handleSend = () => {
    if (onSendMessage(inputText)) {
      setInputText('');
    }
  };

  return (
    <div className="p-4 border-t flex gap-2">
      <Button
        onClick={isRecording ? onStopRecording : onStartRecording}
        variant={isRecording ? "destructive" : "outline"}
        size="icon"
        className="shrink-0"
        disabled={!isConnected}
      >
        {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
      </Button>
      
      <input
        type="text"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        placeholder="Type your message..."
        className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
      />
      
      <Button
        onClick={handleSend}
        variant="default"
        size="icon"
        className="shrink-0"
        disabled={!isConnected}
      >
        <Send className="h-4 w-4" />
      </Button>
    </div>
  );
};