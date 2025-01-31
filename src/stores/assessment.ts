import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { 
  AssessmentStep, 
  AssessmentState, 
  AssessmentResponses,
  AssessmentResults,
  ValidationError,
  AssessmentValidation
} from '@/types/assessment/state';
import { logger } from '@/utils/logger';
import { STEPS } from '@/types/assessment';

const INITIAL_STATE: AssessmentState = {
  id: crypto.randomUUID(),
  currentStep: 'initial',
  responses: {},
  metadata: {
    startTime: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
    attempts: 0,
    analyticsId: crypto.randomUUID(),
    version: '1.0.0'
  },
  isComplete: false,
  isLoading: false,
  results: null,
  error: null,
  validationErrors: [],
  stepHistory: ['initial']
};

const REQUIRED_FIELDS: AssessmentValidation['requiredFields'] = {
  process: ['timeSpent', 'processVolume', 'errorRate'],
  technology: ['digitalTools', 'automationLevel', 'toolStack'],
  team: ['teamSize', 'skillLevel', 'trainingNeeds']
};

interface AssessmentStore extends AssessmentState {
  // Navigation
  setStep: (step: AssessmentStep) => void;
  goBack: () => void;
  
  // Data Management
  updateResponses: (newResponses: Partial<AssessmentResponses>) => void;
  setResults: (results: AssessmentResults) => void;
  
  // State Management
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Validation
  validateStep: (step: AssessmentStep) => AssessmentValidation;
  addValidationError: (error: ValidationError) => void;
  clearValidationErrors: () => void;
  
  // Reset
  reset: () => void;

  // Core Actions
  startAssessment: () => void;
  updateStep: (step: Step, data: unknown) => void;
  completeStep: (step: Step) => void;
  resetAssessment: () => void;

  // Navigation
  canProgress: (step: Step) => boolean;
  getNextStep: (step: Step) => Step | null;
  getPreviousStep: (step: Step) => Step | null;
}

const createInitialAssessment = (): AssessmentState => ({
  id: crypto.randomUUID(),
  currentStep: 'initial',
  responses: {},
  metadata: {
    startTime: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
    attempts: 0,
    analyticsId: crypto.randomUUID(),
    version: '1.0.0'
  },
  isComplete: false,
  isLoading: false,
  results: null,
  error: null,
  validationErrors: [],
  stepHistory: ['initial']
});

export const useAssessmentStore = create<AssessmentStore>()(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,

      setStep: (step) => {
        logger.info('Setting step:', { step });
        set((state) => ({
          currentStep: step,
          stepHistory: [...state.stepHistory, step],
          metadata: {
            ...state.metadata,
            lastUpdated: new Date().toISOString()
          }
        }));
      },

      goBack: () => {
        const { stepHistory } = get();
        if (stepHistory.length > 1) {
          const previousStep = stepHistory[stepHistory.length - 2];
          set((state) => ({
            currentStep: previousStep,
            stepHistory: state.stepHistory.slice(0, -1),
            metadata: {
              ...state.metadata,
              lastUpdated: new Date().toISOString()
            }
          }));
        }
      },

      updateResponses: (newResponses) => {
        logger.info('Updating responses:', { newResponses });
        set((state) => ({
          responses: {
            ...state.responses,
            ...newResponses
          },
          metadata: {
            ...state.metadata,
            lastUpdated: new Date().toISOString()
          }
        }));
      },

      setResults: (results) => {
        logger.info('Setting results:', { results });
        set((state) => ({
          results,
          isComplete: true,
          metadata: {
            ...state.metadata,
            lastUpdated: new Date().toISOString(),
            completedAt: new Date().toISOString()
          }
        }));
      },

      setLoading: (isLoading) => {
        set({ isLoading });
      },

      setError: (error) => {
        set({ error });
      },

      validateStep: (step) => {
        const { responses } = get();
        const errors: ValidationError[] = [];

        // Skip validation for initial and complete steps
        if (step === 'initial' || step === 'complete') {
          return { isValid: true, errors: [], requiredFields: REQUIRED_FIELDS };
        }

        // Get required fields for current step
        const requiredFields = REQUIRED_FIELDS[step as keyof typeof REQUIRED_FIELDS] || [];

        // Check required fields
        requiredFields.forEach((field) => {
          const value = responses[field];
          if (value === undefined || value === null || value === '') {
            errors.push({
              field: field as string,
              message: `${field} is required`,
              step
            });
          }
        });

        // Add validation errors to state
        if (errors.length > 0) {
          set({ validationErrors: errors });
        }

        return {
          isValid: errors.length === 0,
          errors,
          requiredFields: REQUIRED_FIELDS
        };
      },

      addValidationError: (error) => {
        logger.warn('Adding validation error:', { error });
        set((state) => ({
          validationErrors: [...state.validationErrors, error]
        }));
      },

      clearValidationErrors: () => {
        logger.info('Clearing validation errors');
        set({ validationErrors: [] });
      },

      reset: () => {
        logger.info('Resetting assessment');
        set({
          ...INITIAL_STATE,
          id: crypto.randomUUID(),
          metadata: {
            ...INITIAL_STATE.metadata,
            startTime: new Date().toISOString(),
            lastUpdated: new Date().toISOString(),
            analyticsId: crypto.randomUUID()
          }
        });
      },

      // Core Actions
      startAssessment: () => {
        logger.info('Starting new assessment');
        set({ assessment: createInitialAssessment() });
      },

      updateStep: (step, data) => {
        logger.info('Updating step data', { step });
        set((state) => {
          if (!state.assessment) return state;

          return {
            assessment: {
              ...state.assessment,
              data: {
                ...state.assessment.data,
                [step]: data
              },
              lastUpdated: new Date().toISOString()
            }
          };
        });
      },

      completeStep: (step) => {
        logger.info('Completing step', { step });
        set((state) => {
          if (!state.assessment) return state;

          const nextStep = get().getNextStep(step);
          if (!nextStep) {
            return {
              assessment: {
                ...state.assessment,
                isComplete: true,
                lastUpdated: new Date().toISOString()
              }
            };
          }

          return {
            assessment: {
              ...state.assessment,
              step: nextStep,
              isValid: {
                ...state.assessment.isValid,
                [step]: true
              },
              lastUpdated: new Date().toISOString()
            }
          };
        });
      },

      resetAssessment: () => {
        logger.info('Resetting assessment');
        set({ assessment: createInitialAssessment() });
      },

      // Navigation
      canProgress: (step) => {
        const { assessment } = get();
        if (!assessment) return false;

        // Initial can always progress
        if (step === 'initial') return true;

        // Check if current step has data and is valid
        const stepData = assessment.data[step];
        return !!stepData && assessment.isValid[step];
      },

      getNextStep: (step) => {
        const currentIndex = STEPS.indexOf(step);
        if (currentIndex === -1 || currentIndex === STEPS.length - 1) return null;
        return STEPS[currentIndex + 1];
      },

      getPreviousStep: (step) => {
        const currentIndex = STEPS.indexOf(step);
        if (currentIndex <= 0) return null;
        return STEPS[currentIndex - 1];
      }
    }),
    {
      name: 'assessment-store',
      version: 1
    }
  )
); 