import { useEffect, useCallback, useRef } from 'react';
import { monitoring } from '@/monitoring/assessment';
import type { ErrorInfo } from 'react';

export interface MonitoringHookOptions {
  stepId: string;
  enableDetailedTracking?: boolean;
  customMetrics?: Record<string, any>;
}

export function useMonitoring({ 
  stepId,
  enableDetailedTracking = false,
  customMetrics = {}
}: MonitoringHookOptions) {
  const interactionTimeoutRef = useRef<NodeJS.Timeout>();
  const lastInteractionRef = useRef<number>(Date.now());

  useEffect(() => {
    monitoring.startStepTracking(stepId);

    return () => {
      monitoring.trackStepCompletion();
      if (interactionTimeoutRef.current) {
        clearTimeout(interactionTimeoutRef.current);
      }
    };
  }, [stepId]);

  const trackInteraction = useCallback((
    interactionType: string,
    details: Record<string, any> = {}
  ) => {
    const now = Date.now();
    const timeSinceLastInteraction = now - lastInteractionRef.current;
    lastInteractionRef.current = now;

    if (enableDetailedTracking) {
      details.timeSinceLastInteraction = timeSinceLastInteraction;
      details.customMetrics = customMetrics;
    }

    monitoring.trackInteraction(interactionType, details);

    // Track user hesitation
    if (interactionTimeoutRef.current) {
      clearTimeout(interactionTimeoutRef.current);
    }

    interactionTimeoutRef.current = setTimeout(() => {
      monitoring.trackInteraction('user-hesitation', {
        duration: Date.now() - now,
        stepId,
      });
    }, 5000); // Consider user hesitating after 5 seconds of inactivity
  }, [stepId, enableDetailedTracking, customMetrics]);

  const trackError = useCallback((
    error: Error,
    errorInfo?: ErrorInfo,
    context?: Record<string, any>
  ) => {
    monitoring.trackError(error, {
      ...errorInfo,
      context: {
        ...context,
        stepId,
        customMetrics,
      },
    });
  }, [stepId, customMetrics]);

  const getMetrics = useCallback(() => {
    return monitoring.getMetricsSummary();
  }, []);

  return {
    trackInteraction,
    trackError,
    getMetrics,
  };
}

export default useMonitoring;
