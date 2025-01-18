import React, { createContext, useReducer, useState, useContext, useEffect, useCallback, useRef } from 'react';
import { 
  AssessmentState, 
  ValidationError, 
  AssessmentAction, 
  StepTransition,
  StepPerformanceMetrics 
} from '@/types/assessment/state';
import { AssessmentStep, STEP_CONFIG } from '@/types/assessment/steps';
import { AssessmentResponses } from '@/types/assessment/core';
import { assessmentReducer } from './reducer';
import { createAssessmentStore } from './store';
import { validateStepTransition } from '@/utils/assessment/migrations';
import { validateStep } from '@/utils/assessment/validation';
import { calculateResults } from '@/utils/assessment/calculations';
import { logger } from '@/utils/logger';
import { telemetry } from '@/utils/monitoring/telemetry';
import { createPerformanceMonitor } from '@/utils/monitoring/performance';
import { useToast } from '@/components/ui/use-toast';

const SAVE_DEBOUNCE_MS = 500;
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;
const PERFORMANCE_THRESHOLD_MS = 100;

const store = createAssessmentStore();
const performanceMonitor = createPerformanceMonitor('AssessmentContext');

interface AssessmentContextValue {
  state: AssessmentState;
  validationErrors: ValidationError[];
  isInitialized: boolean;
  isLoading: boolean;
  error: string | null;
  setResponse: <K extends keyof AssessmentResponses>(field: K, value: AssessmentResponses[K]) => void;
  setState: React.Dispatch<React.SetStateAction<AssessmentState>>;
  nextStep: () => Promise<void>;
  previousStep: () => void;
  clearValidationErrors: () => void;
  completeAssessment: () => Promise<AssessmentResponses>;
  validateRequiredFields: () => void;
  // New methods
  canMoveToStep: (step: AssessmentStep) => boolean;
  getStepMetrics: () => StepPerformanceMetrics;
  getStepHistory: () => StepTransition[];
  jumpToStep: (step: AssessmentStep) => Promise<void>;
}

interface AssessmentProviderProps {
  children: React.ReactNode;
  initialState?: Partial<{
    isInitialized: boolean;
    currentStep: string;
    error: string | null;
    getStepMetrics: () => StepPerformanceMetrics;
    getStepHistory: () => StepTransition[];
    canMoveToStep: (step: string) => boolean;
  }>;
}

const AssessmentContext = createContext<AssessmentContextValue | null>(null);

export const useAssessment = () => {
  const context = useContext(AssessmentContext);
  if (!context) {
    throw new Error('useAssessment must be used within AssessmentProvider');
  }
  return context;
};

export const AssessmentProvider: React.FC<AssessmentProviderProps> = ({ 
  children,
  initialState = {}
}) => {
  const [state, dispatch] = useReducer(assessmentReducer, {
    currentStep: 'welcome',
    responses: {},
    ...initialState
  });
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [isInitialized, setIsInitialized] = useState(initialState.isInitialized || false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(initialState.error || null);
  const { toast } = useToast();

  // Refs for cleanup and state management
  const saveTimeoutRef = useRef<NodeJS.Timeout>();
  const retryCountRef = useRef(0);
  const unmountedRef = useRef(false);
  const stepHistoryRef = useRef<StepTransition[]>([]);

  // Initialize the context
  useEffect(() => {
    const initContext = async () => {
      const mark = performanceMonitor.start('init_context');
      try {
        const storedState = await store.getInitialState();
        dispatch({ type: 'INITIALIZE', payload: { ...storedState, ...initialState } });
        setIsInitialized(true);

        telemetry.track('assessment_context_initialized', {
          currentStep: state.currentStep,
          hasResponses: Object.keys(state.responses).length > 0
        });

      } catch (err) {
        logger.error('Failed to initialize assessment context:', err);
        setError('Failed to initialize assessment. Please refresh the page.');
        
        telemetry.track('assessment_context_init_failed', {
          error: err instanceof Error ? err.message : 'Unknown error'
        });
      } finally {
        setIsLoading(false);
        performanceMonitor.end(mark);
      }
    };

    initContext();

    return () => {
      unmountedRef.current = true;
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  const debouncedSaveState = useCallback(async (newState: AssessmentState) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(async () => {
      const mark = performanceMonitor.start('save_state');
      try {
        await store.saveState(newState);
        retryCountRef.current = 0;

        if (performanceMonitor.getDuration(mark) > PERFORMANCE_THRESHOLD_MS) {
          telemetry.track('assessment_state_save_slow', {
            duration: performanceMonitor.getDuration(mark)
          });
        }
      } catch (err) {
        logger.error('Failed to save state:', err);
        
        if (retryCountRef.current < MAX_RETRIES) {
          retryCountRef.current++;
          setTimeout(() => {
            if (!unmountedRef.current) {
              debouncedSaveState(newState);
            }
          }, RETRY_DELAY_MS * retryCountRef.current);
        } else {
          toast({
            title: 'Error',
            description: 'Failed to save your progress. Please try again.',
            variant: 'destructive',
          });
        }
      } finally {
        performanceMonitor.end(mark);
      }
    }, SAVE_DEBOUNCE_MS);
  }, [toast]);

  const setResponse = useCallback(<K extends keyof AssessmentResponses>(
    field: K,
    value: AssessmentResponses[K]
  ) => {
    const mark = performanceMonitor.start('set_response');
    try {
      dispatch({ 
        type: 'SET_RESPONSE',
        field,
        value
      });

      debouncedSaveState({
        ...state,
        responses: {
          ...state.responses,
          [field]: value
        }
      });

      telemetry.track('assessment_response_set', {
        field,
        step: state.currentStep,
        duration: performanceMonitor.getDuration(mark)
      });
    } catch (err) {
      logger.error('Failed to set response:', { field, error: err });
      toast({
        title: 'Error',
        description: 'Failed to save your response. Please try again.',
        variant: 'destructive',
      });
    } finally {
      performanceMonitor.end(mark);
    }
  }, [state, debouncedSaveState, toast]);

  const canMoveToStep = useCallback((targetStep: AssessmentStep): boolean => {
    const mark = performanceMonitor.start('validate_step_transition');
    try {
      // Check if step transition is valid
      const isValidTransition = validateStepTransition(state.currentStep, targetStep);
      if (!isValidTransition) {
        return false;
      }

      // Check if current step is valid before moving
      const currentStepConfig = STEP_CONFIG[state.currentStep];
      if (currentStepConfig.requiredFields?.length) {
        const validationResult = validateStep(currentStepConfig, state.responses);
        return validationResult.isValid;
      }

      return true;
    } finally {
      performanceMonitor.end(mark);
    }
  }, [state]);

  const moveToStep = useCallback(async (targetStep: AssessmentStep) => {
    const mark = performanceMonitor.start('move_to_step');
    try {
      if (!canMoveToStep(targetStep)) {
        throw new Error('Invalid step transition');
      }

      dispatch({ type: 'SET_STEP', step: targetStep });
      setValidationErrors([]);

      // Track step transition
      const transition: StepTransition = {
        from: state.currentStep,
        to: targetStep,
        timestamp: new Date().toISOString(),
        isValid: true
      };
      stepHistoryRef.current.push(transition);

      telemetry.track('assessment_step_changed', {
        from: state.currentStep,
        to: targetStep,
        duration: performanceMonitor.getDuration(mark)
      });
    } catch (err) {
      logger.error('Failed to move to step:', err);
      setError('Failed to navigate to the selected step');
      throw err;
    } finally {
      performanceMonitor.end(mark);
    }
  }, [state.currentStep, canMoveToStep]);

  const nextStep = useCallback(async () => {
    const mark = performanceMonitor.start('next_step');
    try {
      const currentConfig = STEP_CONFIG[state.currentStep];
      if (!currentConfig.nextStep) {
        await completeAssessment();
        return;
      }

      await moveToStep(currentConfig.nextStep);
    } catch (err) {
      logger.error('Error in nextStep:', err);
      toast({
        title: 'Error',
        description: 'Failed to proceed to next step. Please try again.',
        variant: 'destructive',
      });
    } finally {
      performanceMonitor.end(mark);
    }
  }, [state.currentStep, moveToStep, completeAssessment, toast]);

  const previousStep = useCallback(() => {
    const mark = performanceMonitor.start('previous_step');
    try {
      const currentConfig = STEP_CONFIG[state.currentStep];
      if (currentConfig.prevStep) {
        moveToStep(currentConfig.prevStep);
      }
    } catch (err) {
      logger.error('Error in previousStep:', err);
      toast({
        title: 'Error',
        description: 'Failed to return to previous step. Please try again.',
        variant: 'destructive',
      });
    } finally {
      performanceMonitor.end(mark);
    }
  }, [state.currentStep, moveToStep, toast]);

  const completeAssessment = useCallback(async () => {
    const mark = performanceMonitor.start('complete_assessment');
    try {
      setIsLoading(true);

      // Calculate final results
      const results = await calculateResults(state.responses);

      dispatch({
        type: 'COMPLETE_ASSESSMENT',
        payload: {
          completed: true,
          results
        }
      });

      telemetry.track('assessment_completed', {
        stepCount: stepHistoryRef.current.length,
        duration: performanceMonitor.getDuration(mark)
      });

      return state.responses;
    } catch (err) {
      logger.error('Failed to complete assessment:', err);
      toast({
        title: 'Error',
        description: 'Failed to complete assessment. Please try again.',
        variant: 'destructive',
      });
      throw err;
    } finally {
      setIsLoading(false);
      performanceMonitor.end(mark);
    }
  }, [state.responses, toast]);

  const validateRequiredFields = useCallback(() => {
    const mark = performanceMonitor.start('validate_fields');
    try {
      const currentConfig = STEP_CONFIG[state.currentStep];
      if (!currentConfig.requiredFields?.length) {
        return;
      }

      const errors: ValidationError[] = [];
      for (const field of currentConfig.requiredFields) {
        if (!state.responses[field as keyof AssessmentResponses]) {
          errors.push({
            field: field as keyof AssessmentResponses,
            message: `${field} is required`,
            step: state.currentStep
          });
        }
      }

      setValidationErrors(errors);

      telemetry.track('assessment_field_validation', {
        step: state.currentStep,
        errorCount: errors.length,
        duration: performanceMonitor.getDuration(mark)
      });
    } finally {
      performanceMonitor.end(mark);
    }
  }, [state.currentStep, state.responses]);

  const getStepMetrics = useCallback((): StepPerformanceMetrics => {
    return store.getStepMetrics(state.currentStep);
  }, [state.currentStep]);

  const getStepHistory = useCallback((): StepTransition[] => {
    return stepHistoryRef.current;
  }, []);

  const contextValue: AssessmentContextValue = {
    state,
    validationErrors,
    isInitialized,
    isLoading,
    error,
    setResponse,
    setState: dispatch,
    nextStep,
    previousStep,
    clearValidationErrors: () => setValidationErrors([]),
    completeAssessment,
    validateRequiredFields,
    canMoveToStep,
    getStepMetrics,
    getStepHistory,
    jumpToStep: moveToStep
  };

  if (!isInitialized) {
    return null;
  }

  return (
    <AssessmentContext.Provider value={contextValue}>
      {children}
    </AssessmentContext.Provider>
  );
};

export { AssessmentContext };
