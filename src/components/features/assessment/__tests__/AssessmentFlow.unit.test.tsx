import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AssessmentFlow } from '../AssessmentFlow';
import { useAssessment } from '@/contexts/assessment/AssessmentContext';
import { useUI } from '@/contexts/ui/UIProvider';
import { telemetry } from '@/utils/monitoring/telemetry';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock dependencies
vi.mock('@/contexts/assessment/AssessmentContext', () => ({
  useAssessment: vi.fn(),
}));

vi.mock('@/contexts/ui/UIProvider', () => ({
  useUI: vi.fn(),
}));

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

describe('AssessmentFlow', () => {
  const mockGetStepMetrics = vi.fn();
  const mockCanMoveToStep = vi.fn();
  const mockGetStepHistory = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // Default mock implementations
    (useAssessment as jest.Mock).mockReturnValue({
      state: {
        currentStep: 'welcome',
        responses: {},
      },
      isInitialized: true,
      getStepMetrics: mockGetStepMetrics,
      canMoveToStep: mockCanMoveToStep,
      getStepHistory: mockGetStepHistory,
      error: null,
    });

    (useUI as jest.Mock).mockReturnValue({
      isLoading: false,
    });

    mockGetStepHistory.mockReturnValue([]);
    mockGetStepMetrics.mockReturnValue({
      renderTime: 50,
      interactionTime: 100,
    });
    mockCanMoveToStep.mockReturnValue(true);
  });

  it('renders loading state when not initialized', () => {
    (useAssessment as jest.Mock).mockReturnValue({
      state: { currentStep: 'welcome' },
      isInitialized: false,
    });

    render(<AssessmentFlow />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders error state when error is present', () => {
    const error = 'Test error message';
    (useAssessment as jest.Mock).mockReturnValue({
      state: { currentStep: 'welcome' },
      isInitialized: true,
      error,
    });

    render(<AssessmentFlow />);
    expect(screen.getByText(error)).toBeInTheDocument();
  });

  it('tracks step changes with telemetry', async () => {
    render(<AssessmentFlow />);

    await waitFor(() => {
      expect(telemetry.track).toHaveBeenCalledWith(
        'assessment_flow_step_changed',
        expect.objectContaining({
          step: 'welcome',
          isInitialized: true,
        })
      );
    });
  });

  it('tracks slow renders', async () => {
    // Mock a slow render
    vi.mock('@/utils/monitoring/performance', () => ({
      createPerformanceMonitor: () => ({
        start: () => 'test-mark',
        end: () => 200, // Over threshold
        getDuration: () => 200,
      }),
    }));

    render(<AssessmentFlow />);

    await waitFor(() => {
      expect(telemetry.track).toHaveBeenCalledWith(
        'assessment_flow_slow_render',
        expect.any(Object)
      );
    });
  });

  it('renders lead capture step correctly', () => {
    (useAssessment as jest.Mock).mockReturnValue({
      state: { currentStep: 'lead-capture' },
      isInitialized: true,
      getStepMetrics: mockGetStepMetrics,
      canMoveToStep: mockCanMoveToStep,
      getStepHistory: mockGetStepHistory,
      error: null,
    });

    render(<AssessmentFlow />);
    expect(screen.getByTestId('lead-capture-form')).toBeInTheDocument();
  });

  it('renders process step correctly', () => {
    (useAssessment as jest.Mock).mockReturnValue({
      state: { currentStep: 'process' },
      isInitialized: true,
      getStepMetrics: mockGetStepMetrics,
      canMoveToStep: mockCanMoveToStep,
      getStepHistory: mockGetStepHistory,
      error: null,
    });

    render(<AssessmentFlow />);
    expect(screen.getByTestId('process-section')).toBeInTheDocument();
  });

  it('handles errors gracefully with ErrorBoundary', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    // Mock a component that throws
    vi.mock('../steps/ProcessSection', () => ({
      default: () => {
        throw new Error('Test error');
      },
    }));

    (useAssessment as jest.Mock).mockReturnValue({
      state: { currentStep: 'process' },
      isInitialized: true,
      getStepMetrics: mockGetStepMetrics,
      canMoveToStep: mockCanMoveToStep,
      getStepHistory: mockGetStepHistory,
      error: null,
    });

    render(<AssessmentFlow />);

    expect(screen.getByText(/Something went wrong/)).toBeInTheDocument();
    expect(telemetry.track).toHaveBeenCalledWith(
      'assessment_flow_error',
      expect.any(Object)
    );

    consoleError.mockRestore();
  });

  it('applies loading state correctly', () => {
    (useUI as jest.Mock).mockReturnValue({
      isLoading: true,
    });

    render(<AssessmentFlow />);
    const flowContainer = screen.getByTestId('assessment-flow');
    expect(flowContainer).toHaveClass('opacity-50', 'pointer-events-none');
  });

  it('tracks performance metrics for step transitions', async () => {
    const { rerender } = render(<AssessmentFlow />);

    // Simulate step change
    (useAssessment as jest.Mock).mockReturnValue({
      state: { currentStep: 'process' },
      isInitialized: true,
      getStepMetrics: mockGetStepMetrics,
      canMoveToStep: mockCanMoveToStep,
      getStepHistory: mockGetStepHistory,
      error: null,
    });

    rerender(<AssessmentFlow />);

    await waitFor(() => {
      expect(telemetry.track).toHaveBeenCalledWith(
        'assessment_flow_step_changed',
        expect.objectContaining({
          step: 'process',
          stepCount: 0,
        })
      );
    });
  });
});
