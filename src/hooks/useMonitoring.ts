import { useCallback, useEffect, useRef } from 'react';
import { monitor } from '@/utils/monitoring/monitor';
import { useAuth } from '@/hooks/useAuth';

interface UseMonitoringOptions {
  componentName: string;
  trackProps?: boolean;
  trackState?: boolean;
  trackEvents?: boolean;
}

export function useMonitoring({
  componentName,
  trackProps = false,
  trackState = false,
  trackEvents = true,
}: UseMonitoringOptions) {
  const { user } = useAuth();
  const mountTime = useRef(performance.now());
  const prevProps = useRef<any>(null);
  const prevState = useRef<any>(null);

  // Track component lifecycle
  useEffect(() => {
    const mountDuration = performance.now() - mountTime.current;
    monitor.trackMetric(`${componentName}_mount`, mountDuration, 'ms', {
      type: 'component_lifecycle',
    });

    return () => {
      const unmountTime = performance.now();
      const totalLifetime = unmountTime - mountTime.current;
      monitor.trackMetric(`${componentName}_lifetime`, totalLifetime, 'ms', {
        type: 'component_lifecycle',
      });
    };
  }, [componentName]);

  // Track prop changes
  const trackPropChanges = useCallback(
    (newProps: any) => {
      if (!trackProps) return;

      const changes: Record<string, { prev: any; next: any }> = {};
      let hasChanges = false;

      Object.keys(newProps).forEach((key) => {
        if (prevProps.current && prevProps.current[key] !== newProps[key]) {
          changes[key] = {
            prev: prevProps.current[key],
            next: newProps[key],
          };
          hasChanges = true;
        }
      });

      if (hasChanges) {
        monitor.trackUserEvent('prop_change', user?.id, {
          component: componentName,
          changes,
        });
      }

      prevProps.current = newProps;
    },
    [componentName, trackProps, user?.id]
  );

  // Track state changes
  const trackStateChanges = useCallback(
    (newState: any) => {
      if (!trackState) return;

      const changes: Record<string, { prev: any; next: any }> = {};
      let hasChanges = false;

      Object.keys(newState).forEach((key) => {
        if (prevState.current && prevState.current[key] !== newState[key]) {
          changes[key] = {
            prev: prevState.current[key],
            next: newState[key],
          };
          hasChanges = true;
        }
      });

      if (hasChanges) {
        monitor.trackUserEvent('state_change', user?.id, {
          component: componentName,
          changes,
        });
      }

      prevState.current = newState;
    },
    [componentName, trackState, user?.id]
  );

  // Track user events
  const trackEvent = useCallback(
    (eventName: string, metadata?: Record<string, any>) => {
      if (!trackEvents) return;

      monitor.trackUserEvent(eventName, user?.id, {
        component: componentName,
        ...metadata,
      });
    },
    [componentName, trackEvents, user?.id]
  );

  // Track errors
  const trackError = useCallback(
    (error: Error, metadata?: Record<string, any>) => {
      monitor.trackError(error, {
        component: componentName,
        userId: user?.id,
        ...metadata,
      });
    },
    [componentName, user?.id]
  );

  // Track performance
  const trackPerformance = useCallback(
    (operationName: string, duration: number) => {
      monitor.trackPerformance(`${componentName}_${operationName}`, duration);
    },
    [componentName]
  );

  return {
    trackPropChanges,
    trackStateChanges,
    trackEvent,
    trackError,
    trackPerformance,
  };
}
