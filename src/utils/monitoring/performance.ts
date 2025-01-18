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

export class PerformanceMonitor {
  private marks: Map<string, number>;
  private component: string;

  constructor(component: string) {
    this.marks = new Map();
    this.component = component;
  }

  mark(name: string): void {
    const fullName = `${this.component}:${name}`;
    this.marks.set(fullName, performance.now());
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
        const startTime = this.marks.get(fullStartName!);
        if (!startTime) {
          throw new Error(`Start mark ${fullStartName} not found`);
        }
        const duration = performance.now() - startTime;
        performance.measure(fullMeasureName, fullStartName);
        return duration;
      } else {
        performance.measure(fullMeasureName);
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
    this.marks.delete(fullName);
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

  getMetrics(): PerformanceMetrics {
    const metrics: PerformanceMetrics = {
      componentLoadTime: 0,
      timeToInteractive: 0,
      renderTime: 0
    };

    try {
      // Get performance entries
      const entries = performance.getEntriesByType('measure');
      entries.forEach(entry => {
        if (entry.name.startsWith(this.component)) {
          const metricName = entry.name.split(':')[1];
          metrics[metricName as keyof PerformanceMetrics] = entry.duration;
        }
      });

      // Add memory usage if available
      if (performance.memory) {
        metrics.memoryUsage = performance.memory.usedJSHeapSize;
      }

      logger.debug('Performance metrics collected', {
        component: this.component,
        metrics
      });
    } catch (err) {
      logger.error('Error collecting performance metrics', {
        component: this.component,
        error: err
      });
    }

    return metrics;
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
