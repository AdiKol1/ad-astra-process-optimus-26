import { useEffect, useCallback, useRef, useMemo } from 'react';
import { performanceMonitor } from '@/utils/performance/monitor';
import { debounce } from '@/utils/helpers';

interface UsePerformanceOptimizationProps {
  componentName: string;
  debounceMs?: number;
  memoizationDeps?: any[];
  onSlowRender?: (duration: number) => void;
}

export function usePerformanceOptimization({
  componentName,
  debounceMs = 300,
  memoizationDeps = [],
  onSlowRender,
}: UsePerformanceOptimizationProps) {
  const renderCount = useRef(0);
  const lastRenderTime = useRef(performance.now());

  // Monitor render performance
  useEffect(() => {
    const currentTime = performance.now();
    const renderDuration = currentTime - lastRenderTime.current;
    
    renderCount.current += 1;
    
    if (renderDuration > 16.67) { // Longer than one frame (60fps)
      console.warn(`Slow render detected in ${componentName}:`, {
        duration: renderDuration,
        renderCount: renderCount.current,
      });
      
      onSlowRender?.(renderDuration);
    }
    
    lastRenderTime.current = currentTime;
    
    return () => {
      // Cleanup render monitoring
    };
  });

  // Debounced callback creator
  const createDebouncedCallback = useCallback((callback: Function) => {
    return debounce(callback, debounceMs);
  }, [debounceMs]);

  // Memoized value creator with deps tracking
  const createMemoizedValue = useMemo(() => {
    const metric = performanceMonitor.startMetric(`memo_${componentName}`);
    
    const result = {
      memoize: <T>(factory: () => T): T => {
        return useMemo(() => {
          const value = factory();
          performanceMonitor.endMetric(metric);
          return value;
        }, memoizationDeps);
      },
    };

    return result;
  }, [componentName, ...memoizationDeps]);

  // Performance optimized event handler
  const createOptimizedEventHandler = useCallback((handler: Function) => {
    return (...args: any[]) => {
      const metric = performanceMonitor.startMetric(`event_${componentName}`);
      try {
        return handler(...args);
      } finally {
        performanceMonitor.endMetric(metric);
      }
    };
  }, [componentName]);

  return {
    renderCount: renderCount.current,
    createDebouncedCallback,
    createMemoizedValue,
    createOptimizedEventHandler,
  };
}
