import React, { createContext, useContext } from 'react';
import { vi } from 'vitest';
import type { AssessmentState, AssessmentStep } from '@/types/assessment/state';
import type { ValidationError } from '@/types/assessment/validation';

interface AssessmentStore extends AssessmentState {
  setStep: (step: AssessmentStep) => void;
  updateResponses: (responses: Record<string, any>) => void;
  setResults: (results: any) => void;
  setValidationErrors: (errors: ValidationError[]) => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
  complete: () => void;
  initialize: () => void;
  save: () => Promise<void>;
  load: () => Promise<void>;
}

const initialState: AssessmentState = {
  id: 'test-assessment',
  currentStep: 'process',
  responses: {},
  metadata: {
    startTime: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
    attempts: 0,
    analyticsId: 'test-analytics-id',
    version: '1.0.0'
  },
  isComplete: false,
  isLoading: false,
  results: null,
  validationErrors: [],
  error: null,
  stepHistory: ['initial', 'process'],
  lastValidStep: 'initial'
};

const AssessmentContext = createContext<AssessmentStore | null>(null);

export const useAssessment = () => {
  const context = useContext(AssessmentContext);
  if (!context) {
    throw new Error('useAssessment must be used within AssessmentProvider');
  }
  return context;
};

interface AssessmentProviderProps {
  children: React.ReactNode;
  initialState?: Partial<AssessmentState>;
}

export const AssessmentProvider: React.FC<AssessmentProviderProps> = ({
  children,
  initialState: propInitialState = {}
}) => {
  const mockStore: AssessmentStore = {
    ...initialState,
    ...propInitialState,
    setStep: vi.fn(),
    updateResponses: vi.fn(),
    setResults: vi.fn(),
    setValidationErrors: vi.fn(),
    setLoading: vi.fn(),
    reset: vi.fn(),
    complete: vi.fn(),
    initialize: vi.fn(),
    save: vi.fn().mockResolvedValue(undefined),
    load: vi.fn().mockResolvedValue(undefined)
  };

  return (
    <AssessmentContext.Provider value={mockStore}>
      {children}
    </AssessmentContext.Provider>
  );
};

export default AssessmentProvider; 