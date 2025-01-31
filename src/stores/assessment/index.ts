import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { 
  AssessmentState, 
  AssessmentStep,
  AssessmentResponses,
  AssessmentResults,
  ValidationError,
  AssessmentMetadata
} from '../../types/assessment/state';
import { logger } from '../../utils/logger';
import { telemetry } from '../../utils/monitoring/telemetry';
import { createPerformanceMonitor } from '../../utils/monitoring/performance';
import { migrateState } from '../../utils/assessment/migrations';

const performanceMonitor = createPerformanceMonitor('AssessmentStore');

const INITIAL_STATE: AssessmentState = {
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
  validationErrors: [],
  stepHistory: ['initial'],
  lastValidStep: 'initial'
};

interface AssessmentActions {
  // State updates
  setResponse: (field: keyof AssessmentResponses, value: any) => void;
  setStep: (step: AssessmentStep) => void;
  setLoading: (isLoading: boolean) => void;
  setComplete: (results: AssessmentResults) => void;
  
  // Validation
  setValidationErrors: (errors: ValidationError[]) => void;
  clearValidationErrors: () => void;
  
  // Navigation
  canMoveToStep: (step: AssessmentStep) => boolean;
  goBack: () => void;
  goForward: () => void;
  
  // Reset
  reset: () => void;
}

interface AssessmentStore extends AssessmentState, AssessmentActions {}

export const useAssessmentStore = create<AssessmentStore>()(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,

      setResponse: (field, value) => {
        const perfMark = performanceMonitor.start('set_response');
        
        set(state => {
          logger.debug('Setting response', {
            component: 'AssessmentStore',
            field,
            value
          });

          const newState = {
            ...state,
            responses: {
              ...state.responses,
              [field]: value
            },
            metadata: {
              ...state.metadata,
              lastUpdated: new Date().toISOString()
            }
          };

          telemetry.track('assessment_response_updated', {
            field,
            currentStep: state.currentStep
          });

          return newState;
        });

        performanceMonitor.end(perfMark);
      },

      setStep: (step) => {
        const perfMark = performanceMonitor.start('set_step');
        
        set(state => {
          const newState = {
            ...state,
            currentStep: step,
            stepHistory: [...state.stepHistory, step],
            metadata: {
              ...state.metadata,
              lastUpdated: new Date().toISOString()
            }
          };

          telemetry.track('step_changed', { 
            from: state.currentStep,
            to: step
          });

          return newState;
        });

        performanceMonitor.end(perfMark);
      },

      setLoading: (isLoading) => set({ isLoading }),

      setComplete: (results) => {
        set(state => ({
          ...state,
          isComplete: true,
          results,
          metadata: {
            ...state.metadata,
            lastUpdated: new Date().toISOString(),
            completedAt: new Date().toISOString()
          }
        }));

        telemetry.track('assessment_completed', { results });
      },

      setValidationErrors: (errors) => {
        set({ validationErrors: errors });
        
        if (errors.length > 0) {
          telemetry.track('validation_errors', { errors });
        }
      },

      clearValidationErrors: () => set({ validationErrors: [] }),

      canMoveToStep: (step) => {
        const state = get();
        const currentStepIndex = state.stepHistory.indexOf(state.currentStep);
        const targetStepIndex = state.stepHistory.indexOf(step);
        
        // Can always move back
        if (targetStepIndex < currentStepIndex) return true;
        
        // Can move forward if target is next step and current step is valid
        if (targetStepIndex === currentStepIndex + 1) {
          return state.validationErrors.length === 0;
        }
        
        return false;
      },

      goBack: () => {
        const state = get();
        const currentIndex = state.stepHistory.indexOf(state.currentStep);
        
        if (currentIndex > 0) {
          const previousStep = state.stepHistory[currentIndex - 1];
          set(state => ({
            ...state,
            currentStep: previousStep
          }));

          telemetry.track('navigation_back', {
            from: state.currentStep,
            to: previousStep
          });
        }
      },

      goForward: () => {
        const state = get();
        const currentIndex = state.stepHistory.indexOf(state.currentStep);
        
        if (currentIndex < state.stepHistory.length - 1) {
          const nextStep = state.stepHistory[currentIndex + 1];
          
          if (state.validationErrors.length === 0) {
            set(state => ({
              ...state,
              currentStep: nextStep
            }));

            telemetry.track('navigation_forward', {
              from: state.currentStep,
              to: nextStep
            });
          } else {
            logger.warn('Cannot move forward - validation errors exist', {
              component: 'AssessmentStore',
              errors: state.validationErrors
            });
          }
        }
      },

      reset: () => {
        set({
          ...INITIAL_STATE,
          metadata: {
            ...INITIAL_STATE.metadata,
            startTime: new Date().toISOString(),
            lastUpdated: new Date().toISOString(),
            attempts: get().metadata.attempts + 1,
            analyticsId: crypto.randomUUID()
          }
        });

        telemetry.track('assessment_reset');
      }
    }),
    {
      name: 'assessment-store',
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        responses: state.responses,
        metadata: state.metadata,
        results: state.results,
        isComplete: state.isComplete,
        lastValidStep: state.lastValidStep
      }),
      onRehydrateStorage: () => (rehydratedState?: AssessmentStore, error?: unknown) => {
        if (error) {
          logger.error('Failed to rehydrate assessment store', {
            component: 'AssessmentStore',
            error
          });
          
          telemetry.track('store_rehydration_failed', {
            error: error instanceof Error ? error.message : 'Unknown error'
          });
          
          // Return to initial state on error
          return INITIAL_STATE;
        }

        if (rehydratedState) {
          logger.info('Assessment store rehydrated', {
            component: 'AssessmentStore',
            metadata: rehydratedState.metadata
          });
          
          telemetry.track('store_rehydrated', {
            version: rehydratedState.metadata.version,
            lastUpdated: rehydratedState.metadata.lastUpdated
          });

          // Validate session timeout
          const lastUpdated = new Date(rehydratedState.metadata.lastUpdated);
          const now = new Date();
          const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

          if (now.getTime() - lastUpdated.getTime() > SESSION_TIMEOUT) {
            logger.info('Assessment session expired', {
              component: 'AssessmentStore',
              lastUpdated: rehydratedState.metadata.lastUpdated
            });
            
            telemetry.track('session_expired', {
              lastUpdated: rehydratedState.metadata.lastUpdated
            });
            
            // Reset to initial state but increment attempts
            return {
              ...INITIAL_STATE,
              metadata: {
                ...INITIAL_STATE.metadata,
                attempts: rehydratedState.metadata.attempts + 1
              }
            };
          }

          // Attempt to migrate state if needed
          const CURRENT_VERSION = 3; // Update this when adding new migrations
          const migrationResult = migrateState(rehydratedState, CURRENT_VERSION);

          if (!migrationResult.success) {
            logger.error('State migration failed', {
              component: 'AssessmentStore',
              error: migrationResult.error
            });
            
            telemetry.track('migration_failed', {
              error: migrationResult.error?.message
            });
            
            return INITIAL_STATE;
          }

          // Return migrated state with updated timestamp
          return {
            ...migrationResult.state,
            metadata: {
              ...migrationResult.state.metadata,
              lastUpdated: new Date().toISOString()
            }
          };
        }

        return INITIAL_STATE;
      }
    }
  )
); 