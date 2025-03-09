import { vi } from 'vitest';

interface PerformanceMetric {
  startTime: number;
  endTime?: number;
  duration?: number;
}

class PerformanceMonitor {
  private metrics: Map<string, PerformanceMetric> = new Map();
  private component: string;

  constructor(component: string) {
    this.component = component;
  }

  start(markName: string): string {
    const fullName = `${this.component}:${markName}`;
    this.metrics.set(fullName, {
      startTime: Date.now()
    });
    return fullName;
  }

  end(markName: string): number {
    const metric = this.metrics.get(markName);
    if (!metric) return 0;

    const endTime = Date.now();
    const duration = endTime - metric.startTime;

    this.metrics.set(markName, {
      ...metric,
      endTime,
      duration
    });

    return duration;
  }

  getDuration(markName: string): number {
    return this.metrics.get(markName)?.duration || 0;
  }

  getMetrics(): Map<string, PerformanceMetric> {
    return this.metrics;
  }

  clear(): void {
    this.metrics.clear();
  }
}

export const createPerformanceMonitor = vi.fn((component: string) => {
  const monitor = new PerformanceMonitor(component);
  return {
    start: vi.fn(monitor.start.bind(monitor)),
    end: vi.fn(monitor.end.bind(monitor)),
    getDuration: vi.fn(monitor.getDuration.bind(monitor)),
    getMetrics: vi.fn(monitor.getMetrics.bind(monitor)),
    clear: vi.fn(monitor.clear.bind(monitor))
  };
});

export default createPerformanceMonitor; 