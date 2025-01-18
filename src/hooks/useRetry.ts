import { useCallback } from 'react';

export function useRetry(maxRetries: number = 3, delayMs: number = 1000) {
  const retry = useCallback(async <T>(operation: () => Promise<T>): Promise<T> => {
    let lastError: Error;
    
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        if (attempt === maxRetries - 1) {
          throw lastError;
        }
        await new Promise(resolve => setTimeout(resolve, delayMs * Math.pow(2, attempt)));
      }
    }
    
    throw lastError!;
  }, [maxRetries, delayMs]);

  return { retry };
}
