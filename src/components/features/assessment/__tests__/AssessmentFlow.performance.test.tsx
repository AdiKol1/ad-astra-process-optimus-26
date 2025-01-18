import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders, createMockState } from '@/utils/test/assessment';
import AssessmentFlow from '../AssessmentFlow';
import { telemetry } from '@/utils/monitoring/telemetry';
import { createPerformanceMonitor } from '@/utils/monitoring/performance';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock dependencies
vi.mock('@/utils/monitoring/telemetry', () => ({
  telemetry: {
    track: vi.fn(),
  },
}));

vi.mock('@/utils/monitoring/performance', () => ({
  createPerformanceMonitor: () => ({
    start: vi.fn().mockReturnValue('test-mark'),
    end: vi.fn().mockReturnValue(100),
    getDuration: vi.fn().mockReturnValue(100),
  }),
}));

describe('AssessmentFlow Performance', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    performance.mark = vi.fn();
    performance.measure = vi.fn();
  });

  describe('Render Performance', () => {
    it('measures initial render time', async () => {
      const startTime = performance.now();
      renderWithProviders(<AssessmentFlow />);
      const renderTime = performance.now() - startTime;

      expect(telemetry.track).toHaveBeenCalledWith(
        'initial_render',
        expect.objectContaining({
          renderTime,
          timestamp: expect.any(Number)
        })
      );
    });

    it('measures rerender performance with state updates', async () => {
      const { rerender } = renderWithProviders(<AssessmentFlow />);
      
      const startTime = performance.now();
      rerender(<AssessmentFlow key="rerender" />);
      const rerenderTime = performance.now() - startTime;

      expect(telemetry.track).toHaveBeenCalledWith(
        'rerender_performance',
        expect.objectContaining({
          renderTime: rerenderTime,
          timestamp: expect.any(Number)
        })
      );
    });
  });

  describe('State Management Performance', () => {
    it('measures state update performance', async () => {
      const user = userEvent.setup();
      renderWithProviders(<AssessmentFlow />);

      const input = screen.getByLabelText(/company name/i);
      const startTime = performance.now();
      await user.type(input, 'Test Company');
      const updateTime = performance.now() - startTime;

      expect(telemetry.track).toHaveBeenCalledWith(
        'state_update_performance',
        expect.objectContaining({
          updateTime,
          operationType: 'input'
        })
      );
    });

    it('measures batch state update performance', async () => {
      renderWithProviders(<AssessmentFlow />, {
        initialState: createMockState({
          responses: {},
          currentStep: 0
        })
      });

      const startTime = performance.now();
      const batchUpdates = Array.from({ length: 100 }, (_, i) => ({
        [`field${i}`]: `value${i}`
      }));

      batchUpdates.forEach(update => {
        // Simulate batch updates
        vi.advanceTimersByTime(1);
      });

      const batchTime = performance.now() - startTime;

      expect(telemetry.track).toHaveBeenCalledWith(
        'batch_update_performance',
        expect.objectContaining({
          batchTime,
          updateCount: batchUpdates.length
        })
      );
    });
  });

  describe('Memory Usage', () => {
    it('tracks memory usage during large data operations', async () => {
      const initialMemory = performance.memory?.usedJSHeapSize;
      
      // Create large dataset
      const largeDataset = Array.from({ length: 10000 }, (_, i) => ({
        [`field${i}`]: `value${i}`
      })).reduce((acc, curr) => ({ ...acc, ...curr }), {});

      renderWithProviders(<AssessmentFlow />, {
        initialState: createMockState({
          responses: largeDataset
        })
      });

      const finalMemory = performance.memory?.usedJSHeapSize;
      const memoryDelta = (finalMemory || 0) - (initialMemory || 0);

      expect(telemetry.track).toHaveBeenCalledWith(
        'memory_usage',
        expect.objectContaining({
          memoryDelta,
          dataSize: Object.keys(largeDataset).length
        })
      );
    });

    it('monitors memory leaks during component lifecycle', async () => {
      const initialMemory = performance.memory?.usedJSHeapSize;
      const { unmount } = renderWithProviders(<AssessmentFlow />);

      // Perform multiple renders
      for (let i = 0; i < 10; i++) {
        unmount();
        renderWithProviders(<AssessmentFlow />);
      }

      const finalMemory = performance.memory?.usedJSHeapSize;
      const memoryDelta = (finalMemory || 0) - (initialMemory || 0);

      expect(telemetry.track).toHaveBeenCalledWith(
        'memory_leak_check',
        expect.objectContaining({
          memoryDelta,
          cycleCount: 10
        })
      );
    });
  });

  describe('Network Performance', () => {
    it('measures API call performance', async () => {
      const user = userEvent.setup();
      renderWithProviders(<AssessmentFlow />);

      // Mock API call
      const mockApiCall = vi.fn().mockImplementation(() => 
        new Promise(resolve => setTimeout(resolve, 100))
      );

      const startTime = performance.now();
      await mockApiCall();
      const apiTime = performance.now() - startTime;

      expect(telemetry.track).toHaveBeenCalledWith(
        'api_performance',
        expect.objectContaining({
          duration: apiTime,
          endpoint: expect.any(String)
        })
      );
    });

    it('tracks concurrent API call performance', async () => {
      renderWithProviders(<AssessmentFlow />);

      const mockApiCalls = Array.from({ length: 5 }, () =>
        vi.fn().mockImplementation(() =>
          new Promise(resolve => setTimeout(resolve, Math.random() * 100))
        )
      );

      const startTime = performance.now();
      await Promise.all(mockApiCalls.map(call => call()));
      const totalTime = performance.now() - startTime;

      expect(telemetry.track).toHaveBeenCalledWith(
        'concurrent_api_performance',
        expect.objectContaining({
          totalTime,
          callCount: mockApiCalls.length
        })
      );
    });
  });

  describe('User Interaction Performance', () => {
    it('measures input latency', async () => {
      const user = userEvent.setup();
      renderWithProviders(<AssessmentFlow />);

      const input = screen.getByLabelText(/company name/i);
      const interactions = [];

      for (let i = 0; i < 10; i++) {
        const startTime = performance.now();
        await user.type(input, 'a');
        interactions.push(performance.now() - startTime);
      }

      const averageLatency = interactions.reduce((a, b) => a + b) / interactions.length;

      expect(telemetry.track).toHaveBeenCalledWith(
        'input_latency',
        expect.objectContaining({
          averageLatency,
          sampleSize: interactions.length
        })
      );
    });

    it('measures event handler performance', async () => {
      const user = userEvent.setup();
      renderWithProviders(<AssessmentFlow />);

      const button = screen.getByText('Next');
      const startTime = performance.now();
      await user.click(button);
      const handlerTime = performance.now() - startTime;

      expect(telemetry.track).toHaveBeenCalledWith(
        'event_handler_performance',
        expect.objectContaining({
          handlerTime,
          eventType: 'click'
        })
      );
    });
  });

  describe('Resource Loading', () => {
    it('tracks resource loading performance', async () => {
      const resources: PerformanceResourceTiming[] = [];
      const observer = new PerformanceObserver((list) => {
        resources.push(...list.getEntries() as PerformanceResourceTiming[]);
      });

      observer.observe({ entryTypes: ['resource'] });
      
      renderWithProviders(<AssessmentFlow />);

      await waitFor(() => {
        expect(telemetry.track).toHaveBeenCalledWith(
          'resource_loading',
          expect.objectContaining({
            resourceCount: resources.length,
            totalLoadTime: expect.any(Number)
          })
        );
      });

      observer.disconnect();
    });
  });
});
