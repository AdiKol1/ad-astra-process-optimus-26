import React from 'react';

interface ChatMessageProps {
  content: string;
  isBot: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ content, isBot }) => {
  return (
    <div className={`flex ${isBot ? 'justify-start' : 'justify-end'}`}>
      <div
        className={`max-w-[80%] rounded-lg p-3 ${
          isBot
            ? 'bg-secondary text-secondary-foreground'
            : 'bg-primary text-primary-foreground'
        }`}
      >
        {content}
      </div>
    </div>
  );
};