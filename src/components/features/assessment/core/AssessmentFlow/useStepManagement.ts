import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAssessmentStore } from '@/stores/assessment';
import { logger } from '@/utils/logger';
import { telemetry } from '@/utils/monitoring/telemetry';
import { createPerformanceMonitor } from '@/utils/monitoring/performance';
import type { Step, StepNavigation, StepValidation } from './types';
import { isValidStep, VALID_STEPS } from './types';

interface UseStepManagementProps {
  initialStep?: Step;
  onComplete?: () => void;
  onError?: (error: Error) => void;
}

export function useStepManagement({
  initialStep = 'process',
  onComplete,
  onError
}: UseStepManagementProps) {
  const navigate = useNavigate();
  const performanceMonitor = createPerformanceMonitor('StepManagement');
  const {
    currentStep,
    setStep,
    goBack,
    validateStep,
    clearValidationErrors,
    setError
  } = useAssessmentStore();

  const [stepValidation, setStepValidation] = useState<StepValidation>({
    isValid: true,
    errors: []
  });

  // Calculate step navigation state
  const getStepNavigation = useCallback((): StepNavigation => {
    const currentIndex = VALID_STEPS.indexOf(currentStep as Step);
    return {
      canGoNext: stepValidation.isValid && currentIndex < VALID_STEPS.length - 1,
      canGoBack: currentIndex > 0,
      currentStepIndex: currentIndex,
      totalSteps: VALID_STEPS.length
    };
  }, [currentStep, stepValidation.isValid]);

  // Handle step change
  const handleStepChange = useCallback(async (newStep: string) => {
    const perfMark = performanceMonitor.start('step_change');

    try {
      if (!isValidStep(newStep)) {
        throw new Error(`Invalid step: ${newStep}`);
      }

      // Validate current step before moving
      const validation = validateStep(currentStep);
      if (!validation.isValid) {
        setStepValidation({
          isValid: false,
          errors: validation.errors.map(e => e.message)
        });
        return;
      }

      // Clear any previous validation errors
      clearValidationErrors();
      
      // Update step
      setStep(newStep);
      navigate(`/assessment/${newStep}`);

      telemetry.track('step_changed', {
        from: currentStep,
        to: newStep,
        duration: performanceMonitor.end(perfMark)
      });

      // Check if assessment is complete
      if (newStep === 'complete') {
        onComplete?.();
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to change step';
      
      logger.error('Step change failed', {
        component: 'StepManagement',
        from: currentStep,
        to: newStep,
        error: errorMessage
      });

      telemetry.track('step_change_failed', {
        from: currentStep,
        to: newStep,
        error: errorMessage,
        duration: performanceMonitor.end(perfMark)
      });

      setError(errorMessage);
      onError?.(error instanceof Error ? error : new Error(errorMessage));
    }
  }, [currentStep, validateStep, clearValidationErrors, setStep, navigate, onComplete, onError]);

  // Handle step validation change
  const handleValidationChange = useCallback((isValid: boolean) => {
    setStepValidation(prev => ({
      ...prev,
      isValid
    }));
  }, []);

  // Initialize step
  useEffect(() => {
    if (initialStep && initialStep !== currentStep) {
      handleStepChange(initialStep);
    }
  }, [initialStep]);

  return {
    currentStep,
    stepValidation,
    navigation: getStepNavigation(),
    onStepChange: handleStepChange,
    onValidationChange: handleValidationChange,
    onBack: goBack
  };
} 