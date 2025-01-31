import React from 'react';
import { LoadingSpinner } from './loading-spinner';
import { Card } from './card';

interface LoadingStateProps {
  children: React.ReactNode;
  isLoading: boolean;
  text?: string;
  spinnerSize?: 'sm' | 'md' | 'lg';
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  children,
  isLoading,
  text = 'Loading...',
  spinnerSize = 'md'
}) => {
  if (!isLoading) {
    return <>{children}</>;
  }

  return (
    <Card className="w-full p-6">
      <div className="flex flex-col items-center justify-center min-h-[200px]">
        <LoadingSpinner size={spinnerSize} className="mb-4" />
        {text && (
          <p className="text-sm text-gray-500">{text}</p>
        )}
      </div>
    </Card>
  );
}; 