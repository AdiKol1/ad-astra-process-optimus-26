import { vi } from 'vitest';

export interface PerformanceMetrics {
  renderTime: number;
  interactionTime: number;
  memoryUsage: number;
  apiLatency: number;
}

export const createPerformanceMonitor = () => {
  let startTime: number;
  let endTime: number;
  const marks = new Map<string, number>();
  const measures = new Map<string, number>();

  return {
    start: (markName: string = 'start') => {
      startTime = performance.now();
      marks.set(markName, startTime);
      return markName;
    },

    end: (markName: string = 'end') => {
      endTime = performance.now();
      marks.set(markName, endTime);
      return endTime;
    },

    measure: (measureName: string, startMark: string, endMark: string) => {
      const start = marks.get(startMark);
      const end = marks.get(endMark);
      if (start && end) {
        const duration = end - start;
        measures.set(measureName, duration);
        return duration;
      }
      return 0;
    },

    getDuration: (measureName?: string) => {
      if (measureName) {
        return measures.get(measureName) || 0;
      }
      return endTime - startTime;
    },

    getMemoryUsage: () => {
      if (performance.memory) {
        return performance.memory.usedJSHeapSize;
      }
      return 0;
    },

    reset: () => {
      marks.clear();
      measures.clear();
      startTime = 0;
      endTime = 0;
    },
  };
};

export const mockPerformanceMetrics = (overrides: Partial<PerformanceMetrics> = {}): PerformanceMetrics => ({
  renderTime: 100,
  interactionTime: 200,
  memoryUsage: 50000000,
  apiLatency: 150,
  ...overrides,
});

export const createPerformanceSpies = () => ({
  renderSpy: vi.fn(),
  interactionSpy: vi.fn(),
  memorySpy: vi.fn(),
  apiSpy: vi.fn(),
});

export const waitForPerformanceMetrics = async (timeout: number = 1000) => {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
};
