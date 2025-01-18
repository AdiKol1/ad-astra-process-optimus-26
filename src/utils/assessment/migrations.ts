import { AssessmentState } from '@/types/assessment/state';
import { AssessmentStep, STEP_CONFIG } from '@/types/assessment/steps';
import { logger } from '@/utils/logger';
import { telemetry } from '@/utils/monitoring/telemetry';

const STEP_MAP: Record<number, AssessmentStep> = {
  0: 'initial',
  1: 'lead-capture',
  2: 'process',
  3: 'marketing',
  4: 'review',
  5: 'complete'
};

interface LegacyState {
  currentStep: number;
  responses: any;
  metadata: {
    startTime: string;
    lastUpdated: string;
    completionTime?: string;
    attempts: number;
    analyticsId: string;
    version: string;
  };
  isComplete: boolean;
  isLoading: boolean;
  results?: any;
}

export const migrateAssessmentState = (oldState: LegacyState): AssessmentState => {
  const startTime = performance.now();
  
  try {
    // Map the numeric step to string literal
    const currentStep = STEP_MAP[oldState.currentStep] || 'initial';
    
    // Create new state with step history
    const newState: AssessmentState = {
      ...oldState,
      currentStep,
      lastValidStep: currentStep,
      stepHistory: [currentStep],
      metadata: {
        ...oldState.metadata,
        lastUpdated: new Date().toISOString()
      }
    };

    const migrationTime = performance.now() - startTime;
    
    // Log successful migration
    logger.info('Successfully migrated assessment state', {
      fromStep: oldState.currentStep,
      toStep: currentStep,
      migrationTime
    });

    // Track migration in telemetry
    telemetry.track('assessment_state_migration', {
      success: true,
      oldVersion: oldState.metadata.version,
      migrationTime
    });

    return newState;
  } catch (error) {
    // Log migration failure
    logger.error('Failed to migrate assessment state', {
      error,
      oldState
    });

    // Track failure in telemetry
    telemetry.track('assessment_state_migration', {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      oldVersion: oldState.metadata.version
    });

    // Return a safe initial state
    return {
      currentStep: 'initial',
      responses: {},
      metadata: {
        startTime: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        attempts: 0,
        analyticsId: crypto.randomUUID(),
        version: '2.0.0'
      },
      isComplete: false,
      isLoading: false,
      stepHistory: ['initial'],
      lastValidStep: 'initial'
    };
  }
};

export const validateStepTransition = (
  from: AssessmentStep,
  to: AssessmentStep
): boolean => {
  const fromConfig = STEP_CONFIG[from];
  const toConfig = STEP_CONFIG[to];

  // Check if direct transition is allowed
  if (fromConfig.nextStep === to || fromConfig.prevStep === to) {
    return true;
  }

  // Check if we're moving backwards to any previous valid step
  if (fromConfig.prevStep) {
    let currentStep = fromConfig.prevStep;
    while (STEP_CONFIG[currentStep]) {
      if (currentStep === to) {
        return true;
      }
      currentStep = STEP_CONFIG[currentStep].prevStep || 'initial';
    }
  }

  return false;
};
