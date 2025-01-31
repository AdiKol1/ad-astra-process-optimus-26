import { useEffect, useRef } from 'react';
import { useAssessmentStore } from '@/stores/assessment';
import { logger } from '@/utils/logger';
import { telemetry } from '@/utils/monitoring/telemetry';
import { createPerformanceMonitor } from '@/utils/monitoring/performance';

const AUTO_SAVE_INTERVAL = 30000; // 30 seconds
const DEBOUNCE_DELAY = 1000; // 1 second

export const useAssessmentAutoSave = () => {
  const store = useAssessmentStore();
  const performanceMonitor = createPerformanceMonitor('AssessmentAutoSave');
  const saveTimeoutRef = useRef<NodeJS.Timeout>();
  const lastSavedRef = useRef<string>('');

  // Function to perform the actual save
  const performSave = async () => {
    const perfMark = performanceMonitor.start('auto_save');
    const currentState = JSON.stringify({
      responses: store.responses,
      currentStep: store.currentStep,
      metadata: store.metadata,
      isComplete: store.isComplete,
      results: store.results
    });

    // Only save if state has changed
    if (currentState !== lastSavedRef.current) {
      try {
        // The actual save is handled by Zustand's persist middleware
        lastSavedRef.current = currentState;
        
        telemetry.track('assessment_auto_saved', {
          step: store.currentStep,
          isComplete: store.isComplete,
          duration: performanceMonitor.end(perfMark)
        });

        logger.debug('Assessment state auto-saved', {
          component: 'AssessmentAutoSave',
          step: store.currentStep
        });
      } catch (error) {
        logger.error('Failed to auto-save assessment state', {
          component: 'AssessmentAutoSave',
          error
        });

        telemetry.track('assessment_auto_save_failed', {
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
  };

  // Debounced save function
  const debouncedSave = () => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(performSave, DEBOUNCE_DELAY);
  };

  // Set up auto-save interval
  useEffect(() => {
    const intervalId = setInterval(performSave, AUTO_SAVE_INTERVAL);

    return () => {
      clearInterval(intervalId);
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  // Watch for state changes and trigger debounced save
  useEffect(() => {
    debouncedSave();
  }, [
    store.responses,
    store.currentStep,
    store.isComplete,
    store.results
  ]);

  return {
    forceSave: performSave
  };
}; 