import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '@/test/utils/renderWithProviders';
import { AssessmentFlow } from '../AssessmentFlow';
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

describe('AssessmentFlow E2E Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('Complete Assessment Journey', () => {
    it('completes full assessment with all sections and validations', async () => {
      const user = userEvent.setup();
      const { container } = renderWithProviders(<AssessmentFlow />);

      // Initial Landing
      await waitFor(() => {
        expect(screen.getByTestId('initial-landing')).toBeInTheDocument();
      });
      await user.click(screen.getByRole('button', { name: /start assessment/i }));

      // Process Section
      await waitFor(() => {
        expect(screen.getByTestId('process-section')).toBeInTheDocument();
      });

      // Fill Process Section
      await user.type(screen.getByLabelText(/manual processes/i), 'Data Entry');
      await user.type(screen.getByLabelText(/time spent/i), '40');
      await user.type(screen.getByLabelText(/error rate/i), '5%');
      await user.click(screen.getByRole('button', { name: /next/i }));

      // Technology Section
      await waitFor(() => {
        expect(screen.getByTestId('technology-section')).toBeInTheDocument();
      });

      // Fill Technology Section
      await user.type(screen.getByLabelText(/current systems/i), 'Excel, Email');
      await user.selectOptions(screen.getByLabelText(/automation level/i), 'BASIC');
      await user.click(screen.getByRole('button', { name: /next/i }));

      // Team Section
      await waitFor(() => {
        expect(screen.getByTestId('team-section')).toBeInTheDocument();
      });

      // Fill Team Section
      await user.selectOptions(screen.getByLabelText(/team size/i), '10-50');
      await user.type(screen.getByLabelText(/departments/i), 'Finance, HR');
      await user.click(screen.getByRole('button', { name: /next/i }));

      // Results Section
      await waitFor(() => {
        expect(screen.getByTestId('results-section')).toBeInTheDocument();
      });

      // Verify Results
      expect(screen.getByText(/efficiency improvement/i)).toBeInTheDocument();
      expect(screen.getByText(/annual cost savings/i)).toBeInTheDocument();

      // Complete Step
      await user.click(screen.getByRole('button', { name: /view report/i }));
      await waitFor(() => {
        expect(screen.getByTestId('complete-step')).toBeInTheDocument();
      });

      // Verify telemetry
      expect(telemetry.track).toHaveBeenCalledWith(
        'assessment_completed',
        expect.objectContaining({
          totalSteps: expect.any(Number),
          completionTime: expect.any(Number),
          validationErrors: 0
        })
      );
    });
  });

  describe('Error Handling and Recovery', () => {
    it('handles validation errors with proper feedback', async () => {
      const user = userEvent.setup();
      renderWithProviders(<AssessmentFlow />);

      // Try to skip Process Section
      await user.click(screen.getByRole('button', { name: /next/i }));
      expect(screen.getByText(/required fields/i)).toBeInTheDocument();

      // Fill one field but not others
      await user.type(screen.getByLabelText(/manual processes/i), 'Data Entry');
      await user.click(screen.getByRole('button', { name: /next/i }));
      expect(screen.getByText(/time spent is required/i)).toBeInTheDocument();

      // Verify error tracking
      expect(telemetry.track).toHaveBeenCalledWith(
        'validation_error',
        expect.objectContaining({
          step: 'process',
          fields: expect.arrayContaining(['timeSpent'])
        })
      );
    });

    it('recovers from network errors during submission', async () => {
      const user = userEvent.setup();
      renderWithProviders(<AssessmentFlow />);

      // Fill required fields
      await user.type(screen.getByLabelText(/manual processes/i), 'Data Entry');
      await user.type(screen.getByLabelText(/time spent/i), '40');
      await user.type(screen.getByLabelText(/error rate/i), '5%');

      // Simulate network error
      vi.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('Network error'));
      await user.click(screen.getByRole('button', { name: /next/i }));

      // Verify error message
      expect(screen.getByText(/connection error/i)).toBeInTheDocument();

      // Retry submission
      vi.spyOn(global, 'fetch').mockResolvedValueOnce({ ok: true } as Response);
      await user.click(screen.getByText(/try again/i));

      // Verify recovery
      await waitFor(() => {
        expect(screen.getByTestId('technology-section')).toBeInTheDocument();
      });
    });
  });

  describe('State Management', () => {
    it('preserves form state across page reloads', async () => {
      const user = userEvent.setup();
      const { unmount } = renderWithProviders(<AssessmentFlow />);

      // Fill Process Section
      await user.type(screen.getByLabelText(/manual processes/i), 'Data Entry');
      await user.type(screen.getByLabelText(/time spent/i), '40');

      // Verify state persistence
      expect(localStorage.getItem('assessment_data')).toContain('Data Entry');

      // Simulate page reload
      unmount();
      renderWithProviders(<AssessmentFlow />);

      // Verify data restored
      expect(screen.getByLabelText(/manual processes/i)).toHaveValue('Data Entry');
      expect(screen.getByLabelText(/time spent/i)).toHaveValue('40');
    });

    it('handles concurrent form updates correctly', async () => {
      const user = userEvent.setup();
      renderWithProviders(<AssessmentFlow />);

      // Simulate rapid updates
      const processInput = screen.getByLabelText(/manual processes/i);
      await Promise.all([
        user.type(processInput, 'Data'),
        user.type(processInput, ' Entry'),
        user.click(screen.getByRole('button', { name: /next/i }))
      ]);

      // Verify final state
      expect(processInput).toHaveValue('Data Entry');
    });
  });

  describe('Performance Monitoring', () => {
    it('tracks render performance metrics', async () => {
      const startTime = performance.now();
      renderWithProviders(<AssessmentFlow />);
      const renderTime = performance.now() - startTime;

      expect(telemetry.track).toHaveBeenCalledWith(
        'initial_render_performance',
        expect.objectContaining({
          renderTime,
          componentCount: expect.any(Number)
        })
      );
    });

    it('monitors form interaction performance', async () => {
      const user = userEvent.setup();
      renderWithProviders(<AssessmentFlow />);

      const startTime = performance.now();
      await user.type(screen.getByLabelText(/manual processes/i), 'Test Input');
      const inputTime = performance.now() - startTime;

      expect(telemetry.track).toHaveBeenCalledWith(
        'form_interaction_performance',
        expect.objectContaining({
          inputTime,
          inputLength: 'Test Input'.length
        })
      );
    });
  });
}); 