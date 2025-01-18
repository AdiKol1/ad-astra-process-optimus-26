import { vi } from 'vitest';

export interface MockApiOptions {
  delay?: number;
  errorRate?: number;
  networkCondition?: 'good' | 'poor' | 'offline';
}

export const createMockApi = (options: MockApiOptions = {}) => {
  const {
    delay = 100,
    errorRate = 0,
    networkCondition = 'good',
  } = options;

  const getNetworkDelay = () => {
    switch (networkCondition) {
      case 'good':
        return delay;
      case 'poor':
        return delay * 3;
      case 'offline':
        throw new Error('Network is offline');
      default:
        return delay;
    }
  };

  const shouldError = () => Math.random() < errorRate;

  return {
    get: vi.fn().mockImplementation(async (path: string) => {
      await new Promise(resolve => setTimeout(resolve, getNetworkDelay()));
      if (shouldError()) {
        throw new Error(`API Error: GET ${path}`);
      }
      return { data: { path } };
    }),

    post: vi.fn().mockImplementation(async (path: string, data: any) => {
      await new Promise(resolve => setTimeout(resolve, getNetworkDelay()));
      if (shouldError()) {
        throw new Error(`API Error: POST ${path}`);
      }
      return { data: { path, ...data } };
    }),

    put: vi.fn().mockImplementation(async (path: string, data: any) => {
      await new Promise(resolve => setTimeout(resolve, getNetworkDelay()));
      if (shouldError()) {
        throw new Error(`API Error: PUT ${path}`);
      }
      return { data: { path, ...data } };
    }),

    delete: vi.fn().mockImplementation(async (path: string) => {
      await new Promise(resolve => setTimeout(resolve, getNetworkDelay()));
      if (shouldError()) {
        throw new Error(`API Error: DELETE ${path}`);
      }
      return { data: { path } };
    }),

    // Helper methods
    setNetworkCondition(condition: MockApiOptions['networkCondition']) {
      options.networkCondition = condition;
    },

    setErrorRate(rate: number) {
      options.errorRate = rate;
    },

    setDelay(ms: number) {
      options.delay = ms;
    },

    // Reset all mocks
    reset() {
      this.get.mockClear();
      this.post.mockClear();
      this.put.mockClear();
      this.delete.mockClear();
      options = {
        delay: 100,
        errorRate: 0,
        networkCondition: 'good',
      };
    },
  };
};

// Mock response generators
export const createMockAssessmentResponse = (overrides = {}) => ({
  id: 'test-assessment-id',
  status: 'in_progress',
  responses: {},
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  ...overrides,
});

export const createMockError = (status: number, message: string) => ({
  status,
  message,
  timestamp: new Date().toISOString(),
});
