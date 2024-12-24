import React, { createContext, useReducer, useCallback, useState, useMemo, useEffect } from 'react';
import { AssessmentState, AssessmentResponses } from '../../types/assessment';
import { ProcessResults } from '../../types/assessment/process';
import { MarketingResults } from '../../types/assessment/marketing';
import { ValidationError } from '../../types/assessment/marketing';
import { useProcess } from './ProcessContext';
import { useMarketing } from './MarketingContext';
import { logger } from '../../utils/logger';
import { useNavigate } from 'react-router-dom';
import { transformProcessData } from '../../utils/assessment/process/adapters';
import { validateMarketingMetrics } from '../../utils/marketingAssessment/adapters';

const STORAGE_KEY = 'assessment_state';

// Define context type
export interface AssessmentContextType {
  state: AssessmentState;
  responses: AssessmentResponses;
  processResults: ProcessResults | null;
  marketingResults: MarketingResults | null;
  validationErrors: ValidationError[];
  setResponse: (key: keyof AssessmentResponses, value: any) => void;
  setCurrentStep: (step: number) => void;
  setAssessmentData: React.Dispatch<React.SetStateAction<any>>;
  nextStep: () => void;
  previousStep: () => void;
  resetAssessment: () => void;
  completeAssessment: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
  clearValidationErrors: () => void;
}

// Create context
export const AssessmentContext = createContext<AssessmentContextType | null>(null);

// Load initial state from storage or use default
const loadInitialState = (): AssessmentState => {
  try {
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (savedState) {
      const parsedState = JSON.parse(savedState);
      logger.info('Loaded assessment state from storage', { state: parsedState });
      return parsedState;
    }
  } catch (error) {
    logger.error('Error loading assessment state from storage:', error);
  }
  
  return {
    currentStep: 1,
    totalSteps: 5,
    responses: {},
    completed: false,
    isLoading: false,
    error: null,
    validationErrors: []
  };
};

const initialState = loadInitialState();

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
  | { type: 'SET_ERROR'; error: string | null }
  | { type: 'SET_VALIDATION_ERRORS'; errors: ValidationError[] }
  | { type: 'PERSIST_STATE' };

// Helper function to validate responses
const validateResponses = (responses: AssessmentResponses): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  // Validate marketing metrics if they exist
  if (responses.marketingBudget || responses.toolStack || responses.automationLevel) {
    const marketingErrors = validateMarketingMetrics({
      marketingBudget: responses.marketingBudget ? parseInt(responses.marketingBudget) : 0,
      toolStack: responses.toolStack || [],
      automationLevel: responses.automationLevel || '0-25%',
      industry: responses.industry || 'Other'
    });
    errors.push(...marketingErrors);
  }

  return errors;
};

// Reducer with persistence
const assessmentReducer = (state: AssessmentState, action: AssessmentAction): AssessmentState => {
  let newState: AssessmentState;
  switch (action.type) {
    case 'SET_RESPONSE': {
      newState = {
        ...state,
        responses: {
          ...state.responses,
          [action.key]: action.value
        },
        validationErrors: []  // Clear previous validation errors
      };
      
      // Validate new responses
      const errors = validateResponses(newState.responses);
      if (errors.length > 0) {
        newState.validationErrors = errors;
      }
      
      break;
    }
    case 'SET_CURRENT_STEP':
      newState = {
        ...state,
        currentStep: action.payload,
        validationErrors: []  // Clear validation errors on step change
      };
      break;
    case 'SET_ASSESSMENT_DATA':
      newState = {
        ...state,
        ...action.payload,
        validationErrors: []  // Clear validation errors when setting new data
      };
      break;
    case 'NEXT_STEP':
      newState = {
        ...state,
        currentStep: Math.min(state.currentStep + 1, state.totalSteps),
        validationErrors: []  // Clear validation errors on step change
      };
      break;
    case 'PREVIOUS_STEP':
      newState = {
        ...state,
        currentStep: Math.max(state.currentStep - 1, 1),
        validationErrors: []  // Clear validation errors on step change
      };
      break;
    case 'RESET':
      newState = loadInitialState();
      break;
    case 'COMPLETE':
      newState = {
        ...state,
        completed: true,
        validationErrors: []  // Clear validation errors on completion
      };
      break;
    case 'SET_LOADING':
      newState = {
        ...state,
        isLoading: action.value
      };
      break;
    case 'SET_ERROR':
      newState = {
        ...state,
        error: action.error,
        isLoading: false  // Ensure loading is false when error occurs
      };
      break;
    case 'SET_VALIDATION_ERRORS':
      newState = {
        ...state,
        validationErrors: action.errors
      };
      break;

    case 'PERSIST_STATE':
      newState = { ...state };
      break;

    default:
      return state;
  }

  // Persist state changes to localStorage
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
    logger.info('Assessment state persisted to storage');
  } catch (error) {
    logger.error('Error persisting assessment state:', error);
  }

  return newState;
};

interface AssessmentProviderProps {
  children: React.ReactNode;
  persistState?: boolean;
}

// Provider component
export const AssessmentProvider: React.FC<AssessmentProviderProps> = ({ 
  children, 
  persistState = true 
}) => {
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

  // Add state persistence effect
  useEffect(() => {
    if (persistState) {
      const handleStorageChange = (e: StorageEvent) => {
        if (e.key === STORAGE_KEY && e.newValue) {
          try {
            const newState = JSON.parse(e.newValue);
            dispatch({ type: 'SET_ASSESSMENT_DATA', payload: newState });
          } catch (error) {
            logger.error('Error parsing storage change:', error);
          }
        }
      };

      window.addEventListener('storage', handleStorageChange);
      return () => window.removeEventListener('storage', handleStorageChange);
    }
  }, [persistState]);

  const completeAssessment = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Validate all responses before completion
      const validationErrors = validateResponses(state.responses);
      if (validationErrors.length > 0) {
        dispatch({ type: 'SET_VALIDATION_ERRORS', errors: validationErrors });
        throw new Error('Please fix validation errors before completing the assessment');
      }

      // Transform and validate data
      const processData = transformProcessData(state.responses);
      
      // Calculate results
      await calculateMetrics(processData);
      await calculateMarketingMetrics(state.responses);

      dispatch({ type: 'COMPLETE' });
      navigate('/assessment/results');
    } catch (err) {
      logger.error('Error completing assessment:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [state.responses, calculateMetrics, calculateMarketingMetrics, navigate]);

  const clearValidationErrors = useCallback(() => {
    dispatch({ type: 'SET_VALIDATION_ERRORS', errors: [] });
  }, []);

  const value = useMemo((): AssessmentContextType => ({
    state,
    responses: state.responses,
    processResults: processState.results,
    marketingResults: marketingState.results,
    validationErrors: state.validationErrors,
    setResponse,
    setCurrentStep,
    setAssessmentData,
    nextStep,
    previousStep,
    resetAssessment,
    completeAssessment,
    isLoading,
    error,
    clearValidationErrors
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
    error,
    clearValidationErrors
  ]);

  return (
    <AssessmentContext.Provider value={value}>
      {children}
    </AssessmentContext.Provider>
  );
};
