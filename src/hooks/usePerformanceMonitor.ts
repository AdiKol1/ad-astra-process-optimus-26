import { useCallback } from 'react';
import { telemetry } from '@/utils/monitoring/telemetry';
import { logger } from '@/utils/logger';

interface PerformanceMetric {
  name: string;
  value?: number;
  timestamp: string;
}

export const usePerformanceMonitor = () => {
  const recordMetric = useCallback((name: string, value?: number) => {
    try {
      const metric: PerformanceMetric = {
        name,
        value,
        timestamp: new Date().toISOString()
      };

      // Track metric in telemetry
      telemetry.track('performance_metric', metric);

      // Log for debugging
      logger.debug('Performance metric recorded:', metric);

      // If we have the Performance API available, use it
      if (typeof performance !== 'undefined' && performance.mark) {
        performance.mark(name);
      }
    } catch (error) {
      const err = error as Error;
      logger.error('Error recording performance metric:', {
        message: err.message,
        stack: err.stack,
        metric: name,
        value
      });
    }
  }, []);

  return { recordMetric };
}; 