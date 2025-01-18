import { ReactNode } from 'react';
import { render } from '@testing-library/react';
import { vi } from 'vitest';

// Performance measurement utilities
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

export const createLargeDataset = (size: number) => {
  return Array.from({ length: size }, (_, i) => ({
    [`field${i}`]: `value${i}`,
    timestamp: Date.now(),
    metadata: {
      type: 'test',
      index: i,
      nested: {
        data: `nested_value_${i}`,
      },
    },
  }));
};

export const measureBatchOperations = async (operations: (() => Promise<void>)[]) => {
  const startTime = performance.now();
  await Promise.all(operations.map(op => op()));
  return performance.now() - startTime;
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

export const measureEventHandlerPerformance = (handler: () => void) => {
  const monitor = createPerformanceMonitor();
  const markName = 'event-handler';
  
  return () => {
    monitor.start(markName);
    handler();
    return monitor.end(markName);
  };
};

export const measureAsyncOperationPerformance = async (operation: () => Promise<void>) => {
  const monitor = createPerformanceMonitor();
  const markName = 'async-operation';
  
  monitor.start(markName);
  await operation();
  return monitor.end(markName);
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

// Utility to track long tasks
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
