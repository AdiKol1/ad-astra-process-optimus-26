import { vi } from 'vitest';

// Mock telemetry
export const telemetry = {
  track: vi.fn(),
  error: vi.fn(),
  info: vi.fn()
};

// Mock performance monitor
export const mockPerformanceMonitor = {
  start: vi.fn().mockReturnValue('mock-mark'),
  end: vi.fn().mockReturnValue(50), // 50ms by default
  clear: vi.fn()
};

export const createPerformanceMonitor = vi.fn().mockReturnValue(mockPerformanceMonitor);
