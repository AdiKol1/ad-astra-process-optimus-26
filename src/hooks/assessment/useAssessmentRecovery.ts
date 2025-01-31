import { useEffect, useState } from 'react';
import { useAssessmentStore } from '@/stores/assessment';
import { logger } from '@/utils/logger';
import { telemetry } from '@/utils/monitoring/telemetry';
import { createPerformanceMonitor } from '@/utils/monitoring/performance';
import type { AssessmentState } from '@/types/assessment/state';

interface RecoveryState {
  isRecovering: boolean;
  hasRecoveredState: boolean;
  lastRecoveryAttempt: Date | null;
  error: Error | null;
}

export const useAssessmentRecovery = () => {
  const store = useAssessmentStore();
  const performanceMonitor = createPerformanceMonitor('AssessmentRecovery');
  const [recoveryState, setRecoveryState] = useState<RecoveryState>({
    isRecovering: false,
    hasRecoveredState: false,
    lastRecoveryAttempt: null,
    error: null
  });

  // Function to validate recovered state
  const validateState = (state: Partial<AssessmentState>): boolean => {
    if (!state.currentStep || !state.responses || !state.metadata) {
      return false;
    }

    // Validate metadata
    if (!state.metadata.startTime || !state.metadata.lastUpdated) {
      return false;
    }

    return true;
  };

  // Function to attempt state recovery
  const attemptRecovery = async () => {
    const perfMark = performanceMonitor.start('recovery_attempt');

    setRecoveryState(prev => ({
      ...prev,
      isRecovering: true,
      error: null
    }));

    try {
      // The actual recovery is handled by Zustand's persist middleware
      // We just need to validate the recovered state and handle any issues
      const currentState = {
        currentStep: store.currentStep,
        responses: store.responses,
        metadata: store.metadata,
        isComplete: store.isComplete,
        results: store.results
      };
      
      if (!validateState(currentState)) {
        throw new Error('Recovered state validation failed');
      }

      // Check for session timeout
      const lastUpdated = new Date(currentState.metadata.lastUpdated);
      const now = new Date();
      const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

      if (now.getTime() - lastUpdated.getTime() > SESSION_TIMEOUT) {
        logger.info('Assessment session expired, starting fresh', {
          component: 'AssessmentRecovery',
          lastUpdated: currentState.metadata.lastUpdated
        });

        store.reset();
        throw new Error('Session expired');
      }

      setRecoveryState(prev => ({
        ...prev,
        isRecovering: false,
        hasRecoveredState: true,
        lastRecoveryAttempt: new Date(),
        error: null
      }));

      telemetry.track('assessment_state_recovered', {
        duration: performanceMonitor.end(perfMark),
        step: currentState.currentStep,
        isComplete: currentState.isComplete
      });

      logger.info('Assessment state recovered successfully', {
        component: 'AssessmentRecovery',
        step: currentState.currentStep
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      logger.error('Failed to recover assessment state', {
        component: 'AssessmentRecovery',
        error: errorMessage
      });

      telemetry.track('assessment_recovery_failed', {
        error: errorMessage,
        duration: performanceMonitor.end(perfMark)
      });

      setRecoveryState(prev => ({
        ...prev,
        isRecovering: false,
        hasRecoveredState: false,
        lastRecoveryAttempt: new Date(),
        error: error instanceof Error ? error : new Error(errorMessage)
      }));
    }
  };

  // Attempt recovery on mount
  useEffect(() => {
    attemptRecovery();
  }, []);

  return {
    ...recoveryState,
    retryRecovery: attemptRecovery
  };
}; 