import { AssessmentState, AssessmentAction, StepTransition } from '@/types/assessment/state';
import { AssessmentStep } from '@/types/assessment/steps';
import { logger } from '@/utils/logger';
import { telemetry } from '@/utils/monitoring/telemetry';
import { validateStepTransition } from '@/utils/assessment/migrations';
import { createPerformanceMonitor } from '@/utils/monitoring/performance';

const performanceMonitor = createPerformanceMonitor('AssessmentReducer');

const createStepTransition = (from: AssessmentStep, to: AssessmentStep, isValid: boolean): StepTransition => ({
  from,
  to,
  timestamp: new Date().toISOString(),
  isValid
});

export const assessmentReducer = (
  state: AssessmentState,
  action: AssessmentAction
): AssessmentState => {
  const startTime = performance.now();
  
  try {
    let newState: AssessmentState;

    switch (action.type) {
      case 'INITIALIZE': {
        logger.debug('Initializing assessment state', {
          component: 'AssessmentReducer',
          payload: action.payload
        });

        newState = {
          ...state,
          ...action.payload,
          stepHistory: [...(state.stepHistory || []), state.currentStep]
        };
        break;
      }

      case 'SET_RESPONSE': {
        const perfMark = performanceMonitor.start('set_response');
        logger.debug('Setting response', {
          component: 'AssessmentReducer',
          field: action.field
        });

        newState = {
          ...state,
          responses: {
            ...state.responses,
            [action.field]: action.value
          },
          metadata: {
            ...state.metadata,
            lastUpdated: new Date().toISOString()
          }
        };
        performanceMonitor.end(perfMark);
        break;
      }

      case 'SET_STEP': {
        const perfMark = performanceMonitor.start('set_step');
        const isValidTransition = validateStepTransition(state.currentStep, action.step);
        
        logger.debug('Setting step', {
          component: 'AssessmentReducer',
          fromStep: state.currentStep,
          toStep: action.step,
          isValidTransition
        });

        // Create step transition record
        const transition = createStepTransition(
          state.currentStep,
          action.step,
          isValidTransition
        );

        newState = {
          ...state,
          currentStep: action.step,
          stepHistory: [...state.stepHistory, action.step],
          metadata: {
            ...state.metadata,
            lastUpdated: new Date().toISOString()
          }
        };

        // Track step change in telemetry
        telemetry.track('assessment_step_change', {
          from: transition.from,
          to: transition.to,
          isValid: transition.isValid,
          timeSpent: performance.now() - startTime
        });

        performanceMonitor.end(perfMark);
        break;
      }

      case 'SET_LAST_VALID_STEP': {
        newState = {
          ...state,
          lastValidStep: action.step,
          metadata: {
            ...state.metadata,
            lastUpdated: new Date().toISOString()
          }
        };
        break;
      }

      case 'ADD_TO_HISTORY': {
        newState = {
          ...state,
          stepHistory: [...state.stepHistory, action.step]
        };
        break;
      }

      case 'COMPLETE_ASSESSMENT': {
        const perfMark = performanceMonitor.start('complete_assessment');
        logger.debug('Completing assessment with results', {
          component: 'AssessmentReducer',
          completed: action.payload.completed
        });

        newState = {
          ...state,
          isComplete: action.payload.completed,
          results: action.payload.results,
          metadata: {
            ...state.metadata,
            completionTime: new Date().toISOString(),
            lastUpdated: new Date().toISOString()
          }
        };

        // Track completion in telemetry
        telemetry.track('assessment_completed', {
          timeToComplete: new Date(newState.metadata.completionTime).getTime() - 
                         new Date(state.metadata.startTime).getTime(),
          stepCount: state.stepHistory.length
        });

        performanceMonitor.end(perfMark);
        break;
      }

      case 'SET_LOADING': {
        newState = {
          ...state,
          isLoading: action.isLoading
        };
        break;
      }

      case 'RESET': {
        const perfMark = performanceMonitor.start('reset_assessment');
        newState = {
          currentStep: 'initial',
          responses: {},
          metadata: {
            startTime: new Date().toISOString(),
            lastUpdated: new Date().toISOString(),
            attempts: (state.metadata.attempts || 0) + 1,
            analyticsId: state.metadata.analyticsId,
            version: state.metadata.version
          },
          isComplete: false,
          isLoading: false,
          stepHistory: ['initial'],
          lastValidStep: 'initial'
        };
        performanceMonitor.end(perfMark);
        break;
      }

      default: {
        logger.warn('Unknown action type', {
          component: 'AssessmentReducer',
          action: action.type
        });
        return state;
      }
    }

    // Calculate and log performance metrics
    const executionTime = performance.now() - startTime;
    logger.debug('Reducer execution complete', {
      component: 'AssessmentReducer',
      action: action.type,
      executionTime
    });

    // Track performance in telemetry if it's slow
    if (executionTime > 16.67) { // More than one frame (60fps)
      telemetry.track('assessment_reducer_slow', {
        action: action.type,
        executionTime
      });
    }

    return newState;
  } catch (error) {
    // Log error and return current state
    logger.error('Error in assessment reducer', {
      component: 'AssessmentReducer',
      action,
      error
    });

    telemetry.track('assessment_reducer_error', {
      action: action.type,
      error: error instanceof Error ? error.message : 'Unknown error'
    });

    return state;
  }
};
