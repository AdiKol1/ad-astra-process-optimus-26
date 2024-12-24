import React from 'react';
import { CircularProgress } from '@mui/material';

interface LoadingStateProps {
  message?: string;
  fullScreen?: boolean;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading...',
  fullScreen = false,
}) => {
  const containerClasses = fullScreen
    ? 'fixed inset-0 flex items-center justify-center bg-white bg-opacity-90 z-50'
    : 'flex flex-col items-center justify-center p-4 min-h-[200px]';

  return (
    <div className={containerClasses}>
      <CircularProgress size={40} className="mb-4" />
      <p className="text-gray-600 text-sm">{message}</p>
    </div>
  );
};
