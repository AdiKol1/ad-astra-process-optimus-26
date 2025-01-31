import { useCallback } from 'react';

export const useErrorBoundary = () => {
  const handleError = useCallback((error: Error) => {
    console.error('Error in component:', error);
    // You can add additional error reporting logic here
    // For example, sending to an error tracking service
  }, []);

  return { handleError };
}; 