import { logger } from '@/utils/logger';

interface PerformanceMetric {
  name: string;
  startTime: number;
  duration?: number;
  metadata?: Record<string, any>;
}

class PerformanceMonitor {
  private metrics: Map<string, PerformanceMetric> = new Map();
  private readonly PERFORMANCE_THRESHOLD = 300; // ms

  startMetric(name: string, metadata?: Record<string, any>) {
    const metric: PerformanceMetric = {
      name,
      startTime: performance.now(),
      metadata,
    };
    this.metrics.set(name, metric);
    return name;
  }

  endMetric(name: string) {
    const metric = this.metrics.get(name);
    if (!metric) {
      logger.warn(`No metric found with name: ${name}`);
      return;
    }

    metric.duration = performance.now() - metric.startTime;
    
    // Log slow operations
    if (metric.duration > this.PERFORMANCE_THRESHOLD) {
      logger.warn('Slow operation detected', {
        operation: metric.name,
        duration: metric.duration,
        metadata: metric.metadata,
      });
    }

    return metric;
  }

  getMetric(name: string) {
    return this.metrics.get(name);
  }

  clearMetrics() {
    this.metrics.clear();
  }

  // React component performance monitoring
  measureComponentRender(componentName: string) {
    const metricName = `render_${componentName}_${Date.now()}`;
    return {
      start: () => this.startMetric(metricName),
      end: () => this.endMetric(metricName),
    };
  }

  // API call performance monitoring
  measureApiCall(endpoint: string, method: string) {
    const metricName = `api_${method}_${endpoint}_${Date.now()}`;
    return {
      start: () => this.startMetric(metricName),
      end: () => this.endMetric(metricName),
    };
  }

  // Resource loading performance
  measureResourceLoad(resourceType: string, resourceUrl: string) {
    const metricName = `load_${resourceType}_${Date.now()}`;
    return {
      start: () => this.startMetric(metricName, { url: resourceUrl }),
      end: () => this.endMetric(metricName),
    };
  }
}

export const performanceMonitor = new PerformanceMonitor();
