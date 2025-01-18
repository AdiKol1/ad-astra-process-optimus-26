import React, { createContext, useContext } from 'react';
import { AssessmentState, ValidationError, StepTransition, StepPerformanceMetrics } from '@/types/assessment/state';
import { AssessmentStep } from '@/types/assessment/steps';
import { AssessmentResponses } from '@/types/assessment/core';
import { vi } from 'vitest';

const mockState: AssessmentState = {
  currentStep: 'welcome',
  responses: {},
  stepHistory: [],
  completed: false,
  startTime: Date.now(),
  lastUpdated: Date.now(),
};

const mockContextValue = {
  state: mockState,
  validationErrors: [],
  isInitialized: true,
  isLoading: false,
  error: null,
  setResponse: vi.fn(),
  setState: vi.fn(),
  nextStep: vi.fn().mockResolvedValue(undefined),
  previousStep: vi.fn(),
  clearValidationErrors: vi.fn(),
  completeAssessment: vi.fn().mockResolvedValue({}),
  validateRequiredFields: vi.fn(),
  canMoveToStep: vi.fn().mockReturnValue(true),
  getStepMetrics: vi.fn().mockReturnValue({
    renderTime: 100,
    interactionTime: 200,
    validationErrors: 0,
    retries: 0,
  }),
  getStepHistory: vi.fn().mockReturnValue([]),
  jumpToStep: vi.fn().mockResolvedValue(undefined),
};

const AssessmentContext = createContext<typeof mockContextValue | null>(null);

export const useAssessment = () => {
  const context = useContext(AssessmentContext);
  if (!context) {
    throw new Error('useAssessment must be used within AssessmentProvider');
  }
  return context;
};

export const AssessmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AssessmentContext.Provider value={mockContextValue}>
      {children}
    </AssessmentContext.Provider>
  );
};

// Helper functions for testing
export const createMockState = (overrides: Partial<AssessmentState> = {}): AssessmentState => ({
  ...mockState,
  ...overrides,
});

export const createMockResponse = <K extends keyof AssessmentResponses>(
  field: K,
  value: AssessmentResponses[K]
) => ({
  [field]: value,
});

export const createMockValidationError = (
  field: string,
  message: string
): ValidationError => ({
  field,
  message,
});

export const createMockStepTransition = (
  from: AssessmentStep,
  to: AssessmentStep,
  timestamp = Date.now()
): StepTransition => ({
  from,
  to,
  timestamp,
});

export const createMockStepMetrics = (
  overrides: Partial<StepPerformanceMetrics> = {}
): StepPerformanceMetrics => ({
  renderTime: 100,
  interactionTime: 200,
  validationErrors: 0,
  retries: 0,
  ...overrides,
});

// Reset all mocks
export const resetMocks = () => {
  Object.values(mockContextValue).forEach(value => {
    if (typeof value === 'function') {
      (value as ReturnType<typeof vi.fn>).mockClear();
    }
  });
};

export { AssessmentContext };
