import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders, createMockState } from '@/utils/test/assessment';
import AssessmentFlow from '../AssessmentFlow';
import { telemetry } from '@/utils/monitoring/telemetry';
import { createPerformanceMonitor } from '@/utils/monitoring/performance';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock telemetry and performance monitoring
vi.mock('@/utils/monitoring/telemetry', () => ({
  telemetry: {
    track: vi.fn(),
  },
}));

vi.mock('@/utils/monitoring/performance', () => ({
  createPerformanceMonitor: () => ({
    start: () => 'test-mark',
    end: () => 100,
    getDuration: () => 100,
  }),
}));

describe('AssessmentFlow Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Complete Assessment Flow', () => {
    it('completes a full assessment journey successfully with performance tracking', async () => {
      const user = userEvent.setup();
      const { state } = renderWithProviders(<AssessmentFlow />);

      // Step 1: Process Details
      await user.type(screen.getByLabelText(/company name/i), 'Test Company');
      await user.type(screen.getByLabelText(/employees/i), '100-500');
      await user.click(screen.getByText('Next'));

      // Verify performance tracking
      expect(telemetry.track).toHaveBeenCalledWith(
        'assessment_flow_step_changed',
        expect.objectContaining({
          step: 1,
          renderTime: expect.any(Number)
        })
      );

      // Step 2: Process Information
      await user.type(screen.getByLabelText(/current process/i), 'Manual data entry');
      await user.type(screen.getByLabelText(/time spent/i), '40');
      await user.click(screen.getByText('Next'));

      // Step 3: Pain Points
      await user.click(screen.getByLabelText(/data accuracy/i));
      await user.click(screen.getByLabelText(/time consuming/i));
      await user.click(screen.getByText('Next'));

      // Step 4: Goals
      await user.click(screen.getByLabelText(/increase efficiency/i));
      await user.click(screen.getByText('Next'));

      // Step 5: Contact Information
      await user.type(screen.getByLabelText(/email/i), 'test@example.com');
      await user.type(screen.getByLabelText(/phone/i), '1234567890');
      await user.click(screen.getByText('Submit'));

      // Verify completion and metrics
      await waitFor(() => {
        expect(screen.getByText(/assessment complete/i)).toBeInTheDocument();
        expect(state.completed).toBe(true);
        expect(telemetry.track).toHaveBeenCalledWith(
          'assessment_completed',
          expect.objectContaining({
            totalTime: expect.any(Number),
            stepCount: expect.any(Number),
            validationErrors: expect.any(Number)
          })
        );
      });
    });

    it('handles validation throughout the flow with error tracking', async () => {
      const user = userEvent.setup();
      renderWithProviders(<AssessmentFlow />);

      // Try to skip required fields
      await user.click(screen.getByText('Next'));
      expect(screen.getByText(/required fields/i)).toBeInTheDocument();

      // Verify error tracking
      expect(telemetry.track).toHaveBeenCalledWith(
        'validation_error',
        expect.objectContaining({
          step: expect.any(Number),
          fields: expect.any(Array)
        })
      );

      // Fill required field and proceed
      await user.type(screen.getByLabelText(/company name/i), 'Test Company');
      await user.click(screen.getByText('Next'));
      expect(screen.queryByText(/required fields/i)).not.toBeInTheDocument();
    });

    it('preserves state between sessions with performance monitoring', async () => {
      const user = userEvent.setup();
      const { unmount } = renderWithProviders(<AssessmentFlow />);

      // Fill some data
      await user.type(screen.getByLabelText(/company name/i), 'Test Company');
      
      // Verify state persistence tracking
      expect(telemetry.track).toHaveBeenCalledWith(
        'state_persisted',
        expect.any(Object)
      );
      
      // Unmount and remount to simulate page refresh
      unmount();
      
      const startTime = performance.now();
      renderWithProviders(<AssessmentFlow />);
      const loadTime = performance.now() - startTime;

      expect(screen.getByDisplayValue('Test Company')).toBeInTheDocument();
      expect(telemetry.track).toHaveBeenCalledWith(
        'state_restored',
        expect.objectContaining({
          loadTime,
          success: true
        })
      );
    });
  });

  describe('Error Recovery', () => {
    it('recovers from network errors during submission with retry tracking', async () => {
      const user = userEvent.setup();
      renderWithProviders(<AssessmentFlow />, {
        initialState: createMockState({
          currentStep: 4,
          responses: {
            company: 'Test Company',
            employees: '100-500',
            email: 'test@example.com'
          }
        })
      });

      // Simulate network error
      vi.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('Network error'));

      await user.click(screen.getByText('Submit'));
      expect(screen.getByText(/connection error/i)).toBeInTheDocument();

      // Verify error tracking
      expect(telemetry.track).toHaveBeenCalledWith(
        'submission_error',
        expect.objectContaining({
          error: 'Network error',
          retryCount: 0
        })
      );

      // Retry submission
      vi.spyOn(global, 'fetch').mockResolvedValueOnce({ ok: true } as Response);
      await user.click(screen.getByText(/try again/i));
      
      await waitFor(() => {
        expect(screen.getByText(/assessment complete/i)).toBeInTheDocument();
        expect(telemetry.track).toHaveBeenCalledWith(
          'submission_retry_success',
          expect.any(Object)
        );
      });
    });

    it('handles concurrent user interactions gracefully with performance monitoring', async () => {
      const user = userEvent.setup();
      renderWithProviders(<AssessmentFlow />);

      // Start performance monitoring
      const startTime = performance.now();

      // Simulate rapid interactions
      const input = screen.getByLabelText(/company name/i);
      await Promise.all([
        user.type(input, 'Test'),
        user.click(screen.getByText('Next')),
        user.type(input, ' Company')
      ]);

      const endTime = performance.now();

      // Verify state remains consistent
      expect(input).toHaveValue('Test Company');

      // Verify performance tracking
      expect(telemetry.track).toHaveBeenCalledWith(
        'concurrent_interactions',
        expect.objectContaining({
          duration: endTime - startTime,
          interactionCount: 3,
          success: true
        })
      );
    });
  });

  describe('Performance Characteristics', () => {
    it('maintains responsive UI during long operations with monitoring', async () => {
      const user = userEvent.setup();
      renderWithProviders(<AssessmentFlow />);

      // Simulate slow API call
      vi.spyOn(global, 'fetch').mockImplementationOnce(
        () => new Promise(resolve => setTimeout(resolve, 1000))
      );

      const startTime = performance.now();

      // UI should remain interactive
      await user.type(screen.getByLabelText(/company name/i), 'Test Company');
      expect(screen.getByLabelText(/company name/i)).not.toBeDisabled();

      const endTime = performance.now();

      // Verify UI responsiveness tracking
      expect(telemetry.track).toHaveBeenCalledWith(
        'ui_responsiveness',
        expect.objectContaining({
          duration: endTime - startTime,
          interactionCount: expect.any(Number),
          inputLag: expect.any(Number)
        })
      );
    });

    it('handles large datasets efficiently with memory tracking', async () => {
      const largeDataset = Array.from({ length: 1000 }, (_, i) => ({
        [`question${i}`]: `answer${i}`
      })).reduce((acc, curr) => ({ ...acc, ...curr }), {});

      const startTime = performance.now();
      const startMemory = performance.memory?.usedJSHeapSize;
      
      renderWithProviders(<AssessmentFlow />, {
        initialState: createMockState({
          responses: largeDataset
        })
      });

      const renderTime = performance.now() - startTime;
      const memoryUsed = performance.memory?.usedJSHeapSize - (startMemory || 0);

      expect(renderTime).toBeLessThan(100); // 100ms threshold

      // Verify performance metrics
      expect(telemetry.track).toHaveBeenCalledWith(
        'large_dataset_render',
        expect.objectContaining({
          renderTime,
          memoryUsed,
          datasetSize: Object.keys(largeDataset).length
        })
      );
    });
  });

  describe('Accessibility Journey', () => {
    it('completes assessment using only keyboard with interaction tracking', async () => {
      const user = userEvent.setup();
      renderWithProviders(<AssessmentFlow />);

      const interactions: string[] = [];

      // Track each keyboard interaction
      const trackInteraction = (type: string) => {
        interactions.push(type);
        telemetry.track('keyboard_interaction', { type });
      };

      // Navigate through form using keyboard
      await user.tab();
      trackInteraction('tab');
      await user.keyboard('Test Company');
      trackInteraction('input');
      await user.tab();
      trackInteraction('tab');
      await user.keyboard('100-500');
      trackInteraction('input');
      await user.tab();
      trackInteraction('tab');
      await user.keyboard('{enter}');
      trackInteraction('enter');

      // Verify navigation worked
      expect(screen.getByText('Step 2 of')).toBeInTheDocument();

      // Verify accessibility metrics
      expect(telemetry.track).toHaveBeenCalledWith(
        'accessibility_journey',
        expect.objectContaining({
          interactionCount: interactions.length,
          interactionTypes: expect.arrayContaining(['tab', 'input', 'enter']),
          success: true
        })
      );
    });

    it('announces status changes to screen readers with timing metrics', async () => {
      const user = userEvent.setup();
      renderWithProviders(<AssessmentFlow />);

      const announcement = screen.getByRole('alert', { hidden: true });
      const startTime = performance.now();
      
      await user.click(screen.getByText('Next'));
      const announcementTime = performance.now() - startTime;

      expect(announcement).toHaveTextContent(/step 2/i);

      // Verify announcement timing
      expect(telemetry.track).toHaveBeenCalledWith(
        'screen_reader_announcement',
        expect.objectContaining({
          announcementTime,
          type: 'step_change'
        })
      );
    });
  });
});
