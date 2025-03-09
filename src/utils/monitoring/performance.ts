import { logger } from '../logger';
import { telemetry } from './telemetry';

// Optional: Comment these out if not needed.
/*
interface PerformanceMetrics {
  componentLoadTime: number;
  timeToInteractive: number;
  renderTime: number;
  memoryUsage?: number;
  networkLatency?: number;
}

interface PerformanceMarks {
  [key: string]: number;
}

interface PerformanceMetric {
  start: number;
  end?: number;
  duration?: number;
}
*/

interface PerformanceMetric {
  name: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  metadata?: Record<string, any>;
}

class PerformanceMonitor {
  private metrics: Map<string, PerformanceMetric> = new Map();
  private readonly component: string;

  constructor(component: string) {
    this.component = component;
  }

  start(name: string): string {
    const metricId = `${this.component}_${name}_${Date.now()}`;
    this.metrics.set(metricId, {
      name,
      startTime: performance.now(),
    });
    return metricId;
  }

  end(metricId: string, metadata: Record<string, any> = {}) {
    const metric = this.metrics.get(metricId);
    if (!metric) {
      logger.warn('No matching performance metric found', { metricId });
      return;
    }

    metric.endTime = performance.now();
    metric.duration = metric.endTime - metric.startTime;
    metric.metadata = metadata;

    // Track the metric
    telemetry.track('performance_metric', {
      component: this.component,
      name: metric.name,
      duration: metric.duration,
      ...metadata
    });

    // Log in development
    if (import.meta.env.DEV) {
      console.log(`Performance metric - ${this.component}:${metric.name}`, {
        duration: `${metric.duration.toFixed(2)}ms`,
        ...metadata
      });
    }

    this.metrics.delete(metricId);
    return metric.duration;
  }

  clearMetrics() {
    this.metrics.clear();
  }
}

export const createPerformanceMonitor = (component: string) => {
  return new PerformanceMonitor(component);
};

export const performanceMonitor = {
  start: (_operation: string) => performance.now(),
  end: (startTime: number) => {
    const duration = performance.now() - startTime;
    if (duration > 16) {
      console.warn('Slow operation detected:', {
        duration: `${duration.toFixed(2)}ms`
      });
    }
    return duration;
  }
};
