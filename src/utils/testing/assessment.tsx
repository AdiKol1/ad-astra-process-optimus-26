import React, { ReactNode } from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, vi } from 'vitest';
import { AssessmentProvider } from '@/contexts/assessment/AssessmentContext';
import { Toaster } from '@/components/ui/toaster';
import { createMockState } from './mocks';
import { measureRenderPerformance } from './performance';

// Mock monitoring hook
vi.mock('@/hooks/useMonitoring', () => ({
  useMonitoring: () => ({
    trackEvent: vi.fn(),
    trackError: vi.fn(),
    trackStateChanges: vi.fn(),
    trackPerformance: vi.fn(),
  }),
}));

// Mock performance hook
vi.mock('@/hooks/usePerformanceOptimization', () => ({
  usePerformanceOptimization: () => ({
    createDebouncedCallback: (fn: any) => fn,
    createMemoizedValue: {
      memoize: (fn: any) => fn(),
    },
    createOptimizedEventHandler: (fn: any) => fn,
  }),
}));

// Mock router
vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
  useLocation: () => ({ pathname: '/assessment' }),
}));

// Custom render function with providers
interface RenderWithProvidersOptions {
  initialState?: any;
  mockNavigate?: ReturnType<typeof vi.fn>;
}

export const renderWithProviders = (
  ui: ReactNode,
  { initialState, mockNavigate = vi.fn() }: RenderWithProvidersOptions = {}
) => {
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <AssessmentProvider>
      {children}
      <Toaster />
    </AssessmentProvider>
  );

  return {
    ...render(ui, { wrapper: Wrapper }),
    mockNavigate,
  };
};

// Custom assertions
export const expectValidationError = async (errorMessage: string) => {
  const alert = await screen.findByRole('alert');
  expect(within(alert).getByText(errorMessage)).toBeInTheDocument();
};

export const expectSuccessfulSubmission = async () => {
  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
};

// Performance testing utilities
export const measureAssessmentRenderTime = async (ui: ReactNode) => {
  const { renderTime, container } = measureRenderPerformance(ui);
  return {
    renderTime,
    container,
  };
};

// State transition testing
interface StateTransition {
  action: string;
  initialState: any;
  expectedState: any;
}

export const testStateTransitions = async (
  ui: ReactNode,
  transitions: StateTransition[]
) => {
  for (const { action, initialState, expectedState } of transitions) {
    const { container } = renderWithProviders(ui, { initialState });
    const user = userEvent.setup();

    // Perform action
    switch (action) {
      case 'next':
        await user.click(screen.getByText(/next/i));
        break;
      case 'previous':
        await user.click(screen.getByText(/previous/i));
        break;
      case 'complete':
        await user.click(screen.getByText(/complete/i));
        break;
      default:
        throw new Error(`Unknown action: ${action}`);
    }

    // Verify state transition
    const savedState = JSON.parse(localStorage.getItem('assessment_state') || '{}');
    expect(savedState).toMatchObject(expectedState);
  }
}; 