import { vi } from 'vitest';

const events: any[] = [];

export const telemetry = {
  track: vi.fn((event: string, data?: any) => {
    events.push({ event, data, timestamp: Date.now() });
  }),
  trackError: vi.fn((error: Error, context?: any) => {
    events.push({ type: 'error', error, context, timestamp: Date.now() });
  }),
  getEvents: vi.fn(() => events),
  clearEvents: vi.fn(() => {
    events.length = 0;
  }),
  initialize: vi.fn(),
  setUser: vi.fn(),
  trackPerformance: vi.fn(),
  trackInteraction: vi.fn(),
  trackValidation: vi.fn(),
  trackNavigation: vi.fn(),
};

export default telemetry; 