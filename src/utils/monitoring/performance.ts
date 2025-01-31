import { logger } from '@/utils/logger';

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

export class PerformanceMonitor {
  private metrics: Map<string, PerformanceMetric> = new Map();
  private component: string;

  constructor(component: string) {
    this.component = component;
  }

  start(operation: string): number {
    const startTime = performance.now();
    this.metrics.set(operation, { start: startTime });
    return startTime;
  }

  end(operation: string | number): void {
    const endTime = performance.now();
    const metric = typeof operation === 'string' 
      ? this.metrics.get(operation)
      : { start: operation };

    if (!metric) {
      console.warn(`No start time found for operation: ${operation}`);
      return;
    }

    const duration = endTime - metric.start;
    this.metrics.set(typeof operation === 'string' ? operation : 'unnamed', {
      ...metric,
      end: endTime,
      duration
    });

    // Report slow operations (> 16ms)
    if (duration > 16) {
      console.warn(`Slow operation detected in ${this.component}:`, {
        operation: typeof operation === 'string' ? operation : 'unnamed',
        duration: `${duration.toFixed(2)}ms`
      });
    }
  }

  getMetrics(): Record<string, number> {
    const result: Record<string, number> = {};
    this.metrics.forEach((metric, operation) => {
      if (metric.duration) {
        result[operation] = metric.duration;
      }
    });
    return result;
  }

  clear(): void {
    this.metrics.clear();
  }

  mark(name: string): void {
    const fullName = `${this.component}:${name}`;
    this.metrics.set(fullName, { start: performance.now() });
    try {
      performance.mark(fullName);
    } catch (error) {
      console.warn(`Failed to create performance mark ${fullName}:`, error);
    }
  }

  measure(name: string, startMark?: string): number {
    const fullStartName = startMark ? `${this.component}:${startMark}` : undefined;
    const fullMeasureName = `${this.component}:${name}`;
    
    try {
      if (startMark) {
        const startTime = this.metrics.get(fullStartName!);
        if (!startTime) {
          throw new Error(`Start mark ${fullStartName} not found`);
        }
        const duration = performance.now() - startTime.start;
        this.metrics.set(fullMeasureName, {
          ...startTime,
          end: performance.now(),
          duration
        });
        return duration;
      } else {
        const entry = performance.getEntriesByName(fullMeasureName).pop();
        return entry ? entry.duration : 0;
      }
    } catch (error) {
      console.warn(`Failed to measure performance ${fullMeasureName}:`, error);
      return 0;
    }
  }

  clearMarks(name: string): void {
    const fullName = `${this.component}:${name}`;
    this.metrics.delete(fullName);
    try {
      performance.clearMarks(fullName);
    } catch (error) {
      console.warn(`Failed to clear performance mark ${fullName}:`, error);
    }
  }

  clearMeasures(name: string): void {
    const fullName = `${this.component}:${name}`;
    try {
      performance.clearMeasures(fullName);
    } catch (error) {
      console.warn(`Failed to clear performance measure ${fullName}:`, error);
    }
  }

  async trackNetworkRequest<T>(
    requestName: string,
    request: Promise<T>
  ): Promise<T> {
    this.mark(`network:${requestName}`);
    
    try {
      const response = await request;
      const latency = this.measure(`network:${requestName}`);
      
      logger.debug('Network request complete', {
        component: this.component,
        request: requestName,
        latency
      });
      
      return response;
    } catch (err) {
      const latency = this.measure(`network:${requestName}`);
      logger.error('Network request failed', {
        component: this.component,
        request: requestName,
        latency,
        error: err
      });
      throw err;
    }
  }

  trackRender(renderFunction: () => void): void {
    this.mark('render');
    
    try {
      renderFunction();
    } finally {
      const renderTime = this.measure('render');
      logger.debug('Component render complete', {
        component: this.component,
        renderTime
      });
    }
  }

  reportMetrics(): void {
    const metrics = this.getMetrics();
    
    // Here we could send metrics to an analytics service
    logger.info('Performance metrics report', {
      component: this.component,
      metrics,
      timestamp: new Date().toISOString()
    });
  }
}

export const createPerformanceMonitor = (component: string) => new PerformanceMonitor(component);

export const performanceMonitor = {
  start: (operation: string) => performance.now(),
  end: (startTime: number) => {
    const duration = performance.now() - startTime;
    if (duration > 16) {
      console.warn('Slow operation detected:', {
        duration: `${duration.toFixed(2)}ms`
      });
    }
  }
};
