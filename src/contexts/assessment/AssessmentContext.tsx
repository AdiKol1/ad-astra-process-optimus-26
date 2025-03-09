import * as React from 'react';
import type { PropsWithChildren } from 'react';
import { AssessmentStep, type AssessmentState, type AssessmentAction } from '@/types/assessment/state';
import { StepMetrics } from '@/types/assessment/metrics';
import { STEP_CONFIG } from '@/types/assessment/steps';

interface AssessmentContextType {
  state: AssessmentState;
  dispatch: React.Dispatch<AssessmentAction>;
  isInitialized: boolean;
  getStepMetrics: () => StepMetrics;
  canMoveToStep: (step: AssessmentStep) => boolean;
  getStepHistory: () => AssessmentStep[];
  error: string | null;
}

const AssessmentContext = React.createContext<AssessmentContextType | null>(null);
AssessmentContext.displayName = 'AssessmentContext';

const initialState: AssessmentState = {
  currentStep: 'initial',
  validationErrors: [],
  isLoading: false,
  results: null,
  error: null,
  stepHistory: ['initial'],
  lastValidStep: 'initial'
};

function assessmentReducer(state: AssessmentState, action: AssessmentAction): AssessmentState {
  switch (action.type) {
    case 'SET_STEP':
      return {
        ...state,
        currentStep: action.step,
        stepHistory: [...state.stepHistory, action.step]
      };
    case 'SET_VALIDATION_ERRORS':
      return {
        ...state,
        validationErrors: action.errors
      };
    case 'CLEAR_VALIDATION_ERRORS':
      return { 
        ...state, 
        validationErrors: [] 
      };
    case 'SET_LOADING':
      return { 
        ...state, 
        isLoading: action.isLoading 
      };
    case 'SET_ERROR':
      return { 
        ...state, 
        error: action.error 
      };
    case 'SET_RESULTS':
      return { 
        ...state, 
        results: action.results 
      };
    default:
      return state;
  }
}

function AssessmentProviderComponent({ children }: PropsWithChildren) {
  const [state, dispatch] = React.useReducer(assessmentReducer, initialState);
  const startTimeRef = React.useRef(Date.now());
  const stepStartTimeRef = React.useRef(Date.now());
  const [isInitialized, setIsInitialized] = React.useState(false);
  
  React.useEffect(() => {
    // Reset step timer when step changes
    stepStartTimeRef.current = Date.now();
  }, [state.currentStep]);
  
  React.useEffect(() => {
    // Initialize after mounting
    setIsInitialized(true);
    return () => setIsInitialized(false);
  }, []);
  
  const getStepMetrics = React.useCallback((): StepMetrics => {
    const now = Date.now();
    return {
      stepDuration: now - stepStartTimeRef.current,
      totalDuration: now - startTimeRef.current,
      currentStep: state.currentStep,
      stepCount: state.stepHistory.length,
      completionPercentage: (state.stepHistory.length / Object.keys(STEP_CONFIG).length) * 100,
      validationErrors: state.validationErrors.length,
      isValid: state.validationErrors.length === 0,
      hasUnsavedChanges: false // TODO: Implement change tracking
    };
  }, [state.currentStep, state.stepHistory.length, state.validationErrors.length]);
  
  const canMoveToStep = React.useCallback((step: AssessmentStep): boolean => {
    const currentStepConfig = STEP_CONFIG[state.currentStep];
    if (!currentStepConfig) return false;
    
    // Can only move to next step if current step is valid
    if (currentStepConfig.nextStep === step) {
      return state.validationErrors.length === 0;
    }
    
    // Can move to previous steps if they exist in history
    return state.stepHistory.includes(step);
  }, [state.currentStep, state.validationErrors.length, state.stepHistory]);
  
  const getStepHistory = React.useCallback((): AssessmentStep[] => {
    return state.stepHistory;
  }, [state.stepHistory]);
  
  const value = React.useMemo(() => ({
    state,
    dispatch,
    isInitialized,
    getStepMetrics,
    canMoveToStep,
    getStepHistory,
    error: state.error
  }), [state, isInitialized, getStepMetrics, canMoveToStep, getStepHistory]);
  
  return (
    <AssessmentContext.Provider value={value}>
      {children}
    </AssessmentContext.Provider>
  );
}

export const AssessmentProvider = React.memo(AssessmentProviderComponent);

export function useAssessment(): AssessmentContextType {
  const context = React.useContext(AssessmentContext);
  if (!context) {
    throw new Error('useAssessment must be used within AssessmentProvider');
  }
  return context;
}
