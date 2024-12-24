import React, { createContext, useReducer, useCallback, useState, useMemo } from 'react';
import { AssessmentState, AssessmentResponses } from '../../types/assessment';
import { ProcessResults } from '../../types/assessment/process';
import { MarketingResults } from '../../types/assessment/marketing';
import { useProcess } from './ProcessContext';
import { useMarketing } from './MarketingContext';
import { logger } from '../../utils/logger';
import { useNavigate } from 'react-router-dom';
import { transformProcessData } from '../../utils/assessment/process/adapters';

// Define context type
export interface AssessmentContextType {
  state: AssessmentState;
  responses: AssessmentResponses;
  processResults: ProcessResults | null;
  marketingResults: MarketingResults | null;
  setResponse: (key: keyof AssessmentResponses, value: any) => void;
  setCurrentStep: (step: number) => void;
  setAssessmentData: React.Dispatch<React.SetStateAction<any>>;
  nextStep: () => void;
  previousStep: () => void;
  resetAssessment: () => void;
  completeAssessment: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

// Create context
export const AssessmentContext = createContext<AssessmentContextType | null>(null);

// Initial state
const initialState: AssessmentState = {
  currentStep: 1,
  totalSteps: 5,
  responses: {},
  completed: false,
  isLoading: false,
  error: null
};

// Action types
type AssessmentAction =
  | { type: 'SET_RESPONSE'; key: keyof AssessmentResponses; value: any }
  | { type: 'SET_CURRENT_STEP'; payload: number }
  | { type: 'SET_ASSESSMENT_DATA'; payload: any }
  | { type: 'NEXT_STEP' }
  | { type: 'PREVIOUS_STEP' }
  | { type: 'RESET' }
  | { type: 'COMPLETE' }
  | { type: 'SET_LOADING'; value: boolean }
  | { type: 'SET_ERROR'; error: string | null };

// Reducer
const assessmentReducer = (state: AssessmentState, action: AssessmentAction): AssessmentState => {
  switch (action.type) {
    case 'SET_RESPONSE':
      return {
        ...state,
        responses: {
          ...state.responses,
          [action.key]: action.value
        }
      };
    case 'SET_CURRENT_STEP':
      return {
        ...state,
        currentStep: action.payload
      };
    case 'SET_ASSESSMENT_DATA':
      return {
        ...state,
        ...action.payload
      };
    case 'NEXT_STEP':
      return {
        ...state,
        currentStep: Math.min(state.currentStep + 1, state.totalSteps)
      };
    case 'PREVIOUS_STEP':
      return {
        ...state,
        currentStep: Math.max(state.currentStep - 1, 1)
      };
    case 'RESET':
      return initialState;
    case 'COMPLETE':
      return {
        ...state,
        completed: true
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.value
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.error
      };
    default:
      return state;
  }
};

// Provider component
export const AssessmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(assessmentReducer, initialState);
  const navigate = useNavigate();
  const { state: processState, calculateMetrics } = useProcess();
  const { state: marketingState, calculateMetrics: calculateMarketingMetrics } = useMarketing();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setResponse = useCallback((key: keyof AssessmentResponses, value: any) => {
    dispatch({ type: 'SET_RESPONSE', key, value });
  }, []);

  const setCurrentStep = useCallback((step: number) => {
    dispatch({ type: 'SET_CURRENT_STEP', payload: step });
  }, []);

  const setAssessmentData = useCallback((data: any) => {
    dispatch({ type: 'SET_ASSESSMENT_DATA', payload: data });
  }, []);

  const nextStep = useCallback(() => {
    dispatch({ type: 'NEXT_STEP' });
  }, []);

  const previousStep = useCallback(() => {
    dispatch({ type: 'PREVIOUS_STEP' });
  }, []);

  const resetAssessment = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  const completeAssessment = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Transform and validate data
      const processData = transformProcessData(state.responses);
      
      // Calculate results
      await calculateMetrics(processData);
      await calculateMarketingMetrics(state.responses);

      dispatch({ type: 'COMPLETE' });
      navigate('/assessment/results');
    } catch (err) {
      logger.error('Error completing assessment:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [state.responses, calculateMetrics, calculateMarketingMetrics, navigate]);

  const value = useMemo((): AssessmentContextType => ({
    state,
    responses: state.responses,
    processResults: processState.results,
    marketingResults: marketingState.results,
    setResponse,
    setCurrentStep,
    setAssessmentData,
    nextStep,
    previousStep,
    resetAssessment,
    completeAssessment,
    isLoading,
    error
  }), [
    state,
    processState.results,
    marketingState.results,
    setResponse,
    setCurrentStep,
    setAssessmentData,
    nextStep,
    previousStep,
    resetAssessment,
    completeAssessment,
    isLoading,
    error
  ]);

  return (
    <AssessmentContext.Provider value={value}>
      {children}
    </AssessmentContext.Provider>
  );
};
