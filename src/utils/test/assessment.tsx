import React, { ReactNode } from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AssessmentProvider } from '@/contexts/AssessmentContext';
import { ToastProvider } from '@/components/ui/toast';
import { vi } from 'vitest';

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

// Test data generators
export const createMockQuestion = (overrides = {}) => ({
  id: 'test-question-1',
  type: 'text',
  text: 'Test Question',
  required: true,
  ...overrides,
});

export const createMockSection = (overrides = {}) => ({
  id: 'test-section-1',
  title: 'Test Section',
  description: 'Test Description',
  questions: [createMockQuestion()],
  ...overrides,
});

export const createMockState = (overrides = {}) => ({
  currentStep: 0,
  totalSteps: 5,
  responses: {},
  completed: false,
  isLoading: false,
  error: null,
  metadata: {
    startTime: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
    attempts: 0,
    analyticsId: 'test-id',
    version: '1.0.0'
  },
  ...overrides,
});

// Custom render function with providers
interface RenderWithProvidersOptions {
  initialState?: any;
  mockNavigate?: ReturnType<typeof vi.fn>;
}

export const renderWithProviders = (
  ui: ReactNode,
  { initialState = createMockState(), mockNavigate = vi.fn() }: RenderWithProvidersOptions = {}
) => {
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <AssessmentProvider initialState={initialState}>
      <ToastProvider>{children}</ToastProvider>
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

// Test scenarios
export const commonTestScenarios = {
  validation: [
    {
      name: 'required field empty',
      data: { value: '' },
      expectedError: 'This field is required',
    },
    {
      name: 'numeric field with text',
      data: { value: 'abc' },
      expectedError: 'Please enter a valid number',
    },
  ],
  navigation: [
    {
      name: 'incomplete step',
      responses: {},
      action: 'next',
      expectedError: 'Please complete all required fields',
    },
  ],
};

// Performance testing utilities
export const measureRenderTime = async (ui: ReactNode) => {
  const start = performance.now();
  const { container } = renderWithProviders(ui);
  const end = performance.now();
  return {
    renderTime: end - start,
    container,
  };
};

// Accessibility testing utilities
export const runA11yTests = async (ui: ReactNode) => {
  const { container } = renderWithProviders(ui);
  // Add accessibility tests here when needed
  return container;
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
