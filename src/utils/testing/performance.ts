import { ReactNode } from 'react';
import { render } from '@testing-library/react';
import { vi } from 'vitest';

// Extend Performance type to include memory property
declare global {
  interface Performance {
    memory?: {
      usedJSHeapSize: number;
      totalJSHeapSize: number;
      jsHeapSizeLimit: number;
    };
  }
}

// Performance measurement utilities
export interface PerformanceMetrics {
  renderTime?: number;
  memoryUsage?: {
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
  } | null;
  resourceMetrics?: {
    resourceCount: number;
    totalLoadTime: number;
    averageLoadTime: number;
    resources: PerformanceResourceTiming[];
  };
  longTaskMetrics?: {
    taskCount: number;
    totalBlockingTime: number;
    averageBlockingTime: number;
    tasks: PerformanceEntry[];
  };
}

export const measureRenderPerformance = (ui: ReactNode) => {
  const startTime = performance.now();
  const { container, unmount } = render(ui);
  const renderTime = performance.now() - startTime;
  return { renderTime, container, unmount };
};

export const measureStateUpdatePerformance = (callback: () => void) => {
  const startTime = performance.now();
  callback();
  return performance.now() - startTime;
};

export const measureMemoryUsage = () => {
  if (performance.memory) {
    return {
      usedJSHeapSize: performance.memory.usedJSHeapSize,
      totalJSHeapSize: performance.memory.totalJSHeapSize,
      jsHeapSizeLimit: performance.memory.jsHeapSizeLimit,
    };
  }
  return null;
};

export const createPerformanceMonitor = () => {
  const marks: Record<string, number> = {};
  const measures: Record<string, number> = {};

  return {
    start: (markName: string) => {
      marks[markName] = performance.now();
      return markName;
    },
    end: (markName: string) => {
      if (marks[markName]) {
        const duration = performance.now() - marks[markName];
        measures[markName] = duration;
        delete marks[markName];
        return duration;
      }
      return 0;
    },
    getMeasure: (markName: string) => measures[markName] || 0,
    getAllMeasures: () => ({ ...measures }),
    clearMeasures: () => {
      Object.keys(marks).forEach(key => delete marks[key]);
      Object.keys(measures).forEach(key => delete measures[key]);
    },
  };
};

export const createResourceLoadingMonitor = () => {
  const resources: PerformanceResourceTiming[] = [];
  const observer = new PerformanceObserver((list) => {
    resources.push(...list.getEntries() as PerformanceResourceTiming[]);
  });

  return {
    start: () => {
      observer.observe({ entryTypes: ['resource'] });
    },
    stop: () => {
      observer.disconnect();
      return resources;
    },
    getMetrics: () => {
      const totalLoadTime = resources.reduce((sum, r) => sum + r.duration, 0);
      const averageLoadTime = totalLoadTime / resources.length;
      return {
        resourceCount: resources.length,
        totalLoadTime,
        averageLoadTime,
        resources: [...resources],
      };
    },
  };
};

export const createLongTaskMonitor = () => {
  const longTasks: PerformanceEntry[] = [];
  const observer = new PerformanceObserver((list) => {
    longTasks.push(...list.getEntries());
  });

  return {
    start: () => {
      observer.observe({ entryTypes: ['longtask'] });
    },
    stop: () => {
      observer.disconnect();
      return longTasks;
    },
    getMetrics: () => {
      const totalBlockingTime = longTasks.reduce((sum, task) => sum + task.duration, 0);
      return {
        taskCount: longTasks.length,
        totalBlockingTime,
        averageBlockingTime: totalBlockingTime / longTasks.length,
        tasks: [...longTasks],
      };
    },
  };
};

// Mock performance.memory if not available
if (!performance.memory) {
  Object.defineProperty(performance, 'memory', {
    value: {
      usedJSHeapSize: 0,
      totalJSHeapSize: 0,
      jsHeapSizeLimit: 0,
    },
  });
}

// Mock implementations for testing
export const mockPerformanceAPI = () => {
  const originalNow = performance.now;
  let currentTime = 0;

  performance.now = vi.fn(() => currentTime);

  return {
    advanceTime: (ms: number) => {
      currentTime += ms;
    },
    restore: () => {
      performance.now = originalNow;
    },
  };
}; 