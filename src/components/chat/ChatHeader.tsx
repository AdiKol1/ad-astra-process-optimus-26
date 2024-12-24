import React from 'react';

interface ChatHeaderProps {
  isConnected: boolean;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ isConnected }) => {
  return (
    <div className="p-4 border-b flex justify-between items-center bg-primary text-primary-foreground">
      <h3 className="font-semibold">AI Assistant</h3>
      <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
    </div>
  );
};