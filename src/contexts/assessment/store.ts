import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { telemetry } from '@/utils/monitoring/telemetry';
import { logger } from '@/utils/logger';
import { createPerformanceMonitor } from '@/utils/monitoring/performance';
import type { 
  AssessmentState, 
  AssessmentResponses, 
  AssessmentResults, 
  ValidationError,
  StepPerformanceMetrics,
  StepTransition
} from '@/types/assessment/state';
import { 
  STEP_CONFIG, 
  STEP_ORDER, 
  getNextStep, 
  getPreviousStep, 
  getStepProgress,
  canMoveToStep,
  type AssessmentStep
} from '@/types/assessment/steps';
import { ResultsCalculator } from '@/services/assessment/results-calculator';

const performanceMonitor = createPerformanceMonitor('AssessmentStore');

const initialState: AssessmentState = {
  id: uuidv4(),
  currentStep: 'initial',
  responses: {},
  metadata: {
    startTime: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
    attempts: 0,
    analyticsId: uuidv4(),
    version: '1.0.0'
  },
  isComplete: false,
  isLoading: false,
  isInitialized: false,
  results: null,
  error: null,
  validationErrors: [],
  stepHistory: ['initial'],
  lastValidStep: 'initial'
};

export interface AssessmentStore extends AssessmentState {
  setStep: (step: AssessmentStep) => void;
  updateResponses: (responses: Partial<AssessmentResponses>) => void;
  setResults: (results: AssessmentResults) => void;
  setLoading: (isLoading: boolean) => void;
  setComplete: (isComplete: boolean) => void;
  setInitialized: (isInitialized: boolean) => void;
  addValidationError: (error: ValidationError) => void;
  clearValidationErrors: () => void;
  resetAssessment: () => void;
  startAssessment: () => Promise<void>;
  completeStep: (step: AssessmentStep) => void;
  nextStep: () => Promise<void>;
  previousStep: () => void;
  validateRequiredFields: () => void;
  canMoveToStep: (targetStep: AssessmentStep) => boolean;
  getStepMetrics: (step: AssessmentStep) => StepPerformanceMetrics;
  getStepHistory: () => StepTransition[];
  setError: (error: Error | null) => void;
}

export const useAssessmentStore = create<AssessmentStore>((set, get) => {
  const startTime = performance.now();

  return {
    ...initialState,

    setInitialized: (isInitialized: boolean) => {
      const perfMark = performanceMonitor.start('set_initialized');
      console.log('AssessmentStore: Setting initialized state:', isInitialized);
      try {
        set({ isInitialized });
        if (isInitialized) {
          console.log('AssessmentStore: Store initialized successfully');
          telemetry.track('assessment_initialized', {
            timestamp: new Date().toISOString()
          });
        } else {
          console.log('AssessmentStore: Store initialization cleared');
        }
        performanceMonitor.end(perfMark);
      } catch (error) {
        console.error('AssessmentStore: Error setting initialized state:', error);
        logger.error('Error in setInitialized', { error });
        telemetry.track('assessment_initialization_error', {
          error: error instanceof Error ? error.message : 'Unknown error'
        });
        throw error;
      }
    },

    setStep: (step: AssessmentStep) => {
      const perfMark = performanceMonitor.start('set_step');
      console.log('setStep called with:', step);
      
      try {
        const currentStep = get().currentStep;
        const timestamp = new Date().toISOString();
        
        // Validate step transition
        if (!canMoveToStep(currentStep, step)) {
          throw new Error(`Invalid step transition from ${currentStep} to ${step}`);
        }
        
        set((state) => ({
          currentStep: step,
          stepHistory: [...state.stepHistory, step],
          metadata: {
            ...state.metadata,
            lastUpdated: timestamp
          }
        }));

        telemetry.track('step_transition', {
          from: currentStep,
          to: step,
          timestamp,
          isValid: true,
          executionTime: performance.now() - startTime
        });

        logger.info('Step transition successful', {
          from: currentStep,
          to: step,
          timestamp
        });

        performanceMonitor.end(perfMark);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        const errorDetails = {
          message: errorMessage,
          step,
          currentStep: get().currentStep
        };
        
        logger.error('Error setting step:', errorDetails);
        telemetry.track('step_transition_error', {
          error: errorMessage,
          from: get().currentStep,
          to: step
        });
        throw error;
      }
    },

    updateResponses: (responses: Partial<AssessmentResponses>) => {
      set((state) => ({
        responses: { ...state.responses, ...responses },
        metadata: {
          ...state.metadata,
          lastUpdated: new Date().toISOString()
        }
      }));

      telemetry.track('responses_updated', {
        timestamp: new Date().toISOString()
      } as Record<string, unknown>);
    },

    setResults: (results: AssessmentResults) => {
      set({ results });
      telemetry.track('results_updated', { results } as Record<string, unknown>);
    },

    setLoading: (isLoading: boolean) => set({ isLoading }),

    setComplete: (isComplete: boolean) => {
      set((state) => ({
        isComplete,
        metadata: {
          ...state.metadata,
          completedAt: isComplete ? new Date().toISOString() : undefined
        }
      }));
      
      if (isComplete) {
        telemetry.track('assessment_completed', {} as Record<string, unknown>);
      }
    },

    setError: (error: Error | null) => {
      set({ error });
      if (error) {
        logger.error('Assessment error:', error);
        telemetry.track('assessment_error', {
          error: error.message,
          stack: error.stack
        } as Record<string, unknown>);
      }
    },

    addValidationError: (error: ValidationError) => {
      set((state) => ({
        validationErrors: [...state.validationErrors, error]
      }));
      logger.error('Validation error:', error);
    },

    clearValidationErrors: () => set({ validationErrors: [] }),

    resetAssessment: () => {
      const newState = {
        ...initialState,
        id: uuidv4(),
        metadata: {
          ...initialState.metadata,
          startTime: new Date().toISOString(),
          lastUpdated: new Date().toISOString(),
          analyticsId: uuidv4(),
          attempts: get().metadata.attempts + 1
        }
      };
      set(newState);
      telemetry.track('assessment_reset', {} as Record<string, unknown>);
    },

    startAssessment: async () => {
      console.log('startAssessment called');
      const newState = {
        ...initialState,
        id: uuidv4(),
        metadata: {
          ...initialState.metadata,
          startTime: new Date().toISOString(),
          lastUpdated: new Date().toISOString(),
          analyticsId: uuidv4(),
          attempts: get().metadata.attempts + 1
        }
      };
      
      try {
        set(newState);
        telemetry.track('assessment_started', {
          timestamp: new Date().toISOString(),
          metadata: newState.metadata
        } as Record<string, unknown>);
        
        logger.info('Assessment started', {
          id: newState.id,
          timestamp: newState.metadata.startTime
        });
      } catch (error) {
        const errorDetails = {
          message: error instanceof Error ? error.message : 'Unknown error',
          metadata: newState.metadata
        };
        
        logger.error('Error starting assessment:', errorDetails);
        throw error;
      }
    },

    completeStep: (step: AssessmentStep) => {
      const state = get();
      const nextStep = getNextStep(step);
      
      if (nextStep && state.canMoveToStep(nextStep)) {
        // Special case for team step - if it's complete, go to social-media step instead of detailed-results
        if (step === 'team' && nextStep === 'detailed-results') {
          // Override the next step to go to social-media instead
          state.setStep('social-media');
        }
        // If moving from social-media step to detailed-results, calculate and set results
        else if (step === 'social-media' && nextStep === 'detailed-results') {
          state.setLoading(true);
          try {
            const resultsCalculator = new ResultsCalculator();
            const results = resultsCalculator.calculateResults(state.responses);
            state.setResults(results);
            logger.info('Results calculated successfully', { 
              score: results.score
            });
            telemetry.track('results_calculated', {
              score: results.score,
              timestamp: new Date().toISOString()
            });
          } catch (error) {
            logger.error('Error calculating results', { error });
            state.setError(error instanceof Error ? error : new Error('Failed to calculate results'));
          } finally {
            state.setLoading(false);
          }
          state.setStep(nextStep);
        }
        // Default case - just move to the next step
        else {
          state.setStep(nextStep);
        }
      } else {
        state.addValidationError({
          field: 'step',
          message: 'Cannot proceed to next step - validation failed',
          step: state.currentStep,
          questionId: 'step_validation'
        });
      }
    },

    nextStep: async () => {
      const state = get();
      const nextStep = getNextStep(state.currentStep);
      
      if (nextStep && state.canMoveToStep(nextStep)) {
        state.setStep(nextStep);
      } else {
        state.addValidationError({
          field: 'step',
          message: 'Cannot proceed to next step - validation failed',
          step: state.currentStep,
          questionId: 'step_validation'
        });
      }
    },

    previousStep: () => {
      const state = get();
      const prevStep = getPreviousStep(state.currentStep);
      
      if (prevStep) {
        state.setStep(prevStep);
      }
    },

    validateRequiredFields: () => {
      const state = get();
      const currentStep = state.currentStep;
      const config = STEP_CONFIG[currentStep];
      
      if (!config?.requiredFields?.length) {
        state.clearValidationErrors();
        return;
      }

      const missingFields = config.requiredFields.filter(field => {
        const value = state.responses[field as keyof AssessmentResponses];
        return value === undefined || value === null || value === '';
      });

      if (missingFields.length > 0) {
        missingFields.forEach(field => {
          state.addValidationError({
            field,
            message: `${field} is required`,
            step: currentStep,
            questionId: field
          });
        });
      } else {
        state.clearValidationErrors();
      }
    },

    canMoveToStep: (targetStep: AssessmentStep) => {
      const state = get();
      return canMoveToStep(state.currentStep, targetStep);
    },

    getStepMetrics: (step: AssessmentStep): StepPerformanceMetrics => {
      return {
        stepId: step,
        loadTime: 0,
        errorCount: get().validationErrors.filter(error => error.step === step).length
      };
    },

    getStepHistory: (): StepTransition[] => {
      const state = get();
      return state.stepHistory.map((step, index) => ({
        from: index === 0 ? 'initial' : state.stepHistory[index - 1],
        to: step,
        timestamp: state.metadata.lastUpdated,
        isValid: !state.validationErrors.some(error => error.step === step)
      }));
    }
  };
}); 