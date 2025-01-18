import { useRef, useCallback } from 'react';

export function useRateLimit(timeoutMs: number = 1000) {
  const lastCallTime = useRef<number>(0);

  const isRateLimited = useCallback(() => {
    const now = Date.now();
    return now - lastCallTime.current < timeoutMs;
  }, [timeoutMs]);

  const trackRequest = useCallback(() => {
    lastCallTime.current = Date.now();
  }, []);

  return { isRateLimited, trackRequest };
}
