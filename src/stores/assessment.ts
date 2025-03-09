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
  stepHistory: ['initial'],
  lastValidStep: 'initial'
};

const REQUIRED_FIELDS: AssessmentValidation['requiredFields'] = {
  process: ['timeSpent', 'processVolume', 'errorRate'],
  technology: ['digitalTools', 'automationLevel', 'toolStack'],
  team: ['teamSize', 'skillLevel', 'trainingNeeds']
};

const STEP_ORDER: AssessmentStep[] = [
  'initial',
  'process',
  'technology',
  'team',
  'lead-capture',
  'complete'
];

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
  updateStep: (step: AssessmentStep, data: unknown) => void;
  completeStep: (step: AssessmentStep) => void;
  resetAssessment: () => void;

  // Navigation
  canProgress: (step: AssessmentStep) => boolean;
  getNextStep: (step: AssessmentStep) => AssessmentStep | null;
  getPreviousStep: (step: AssessmentStep) => AssessmentStep | null;
}

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
              step,
              questionId: String(field)
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

      startAssessment: () => {
        logger.info('Starting new assessment');
        set({ ...INITIAL_STATE });
      },

      updateStep: (step, data) => {
        logger.info('Updating step data', { step, data });
        set((state) => ({
          responses: {
            ...state.responses,
            [step]: data
          },
          metadata: {
            ...state.metadata,
            lastUpdated: new Date().toISOString()
          }
        }));
      },

      completeStep: (step) => {
        logger.info('Completing step', { step });
        const nextStep = get().getNextStep(step);
        if (nextStep) {
          get().setStep(nextStep);
        } else {
          set({ isComplete: true });
        }
      },

      resetAssessment: () => {
        logger.info('Resetting assessment');
        set({ ...INITIAL_STATE });
      },

      canProgress: (step) => {
        const validation = get().validateStep(step);
        return validation.isValid;
      },

      getNextStep: (step) => {
        const currentIndex = STEP_ORDER.indexOf(step);
        if (currentIndex === -1 || currentIndex === STEP_ORDER.length - 1) {
          return null;
        }
        return STEP_ORDER[currentIndex + 1];
      },

      getPreviousStep: (step) => {
        const currentIndex = STEP_ORDER.indexOf(step);
        if (currentIndex <= 0) {
          return null;
        }
        return STEP_ORDER[currentIndex - 1];
      }
    }),
    {
      name: 'assessment-store',
      version: 1
    }
  )
); 