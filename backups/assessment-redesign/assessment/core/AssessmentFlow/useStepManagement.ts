import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAssessmentStore } from '@/stores/assessment';
import { logger } from '@/utils/logger';
import { telemetry } from '@/utils/monitoring/telemetry';
import { createPerformanceMonitor } from '@/utils/monitoring/performance';
import type { StepNavigation, StepValidation, ValidStep } from '@/types/assessment/navigation';
import { isValidStep, VALID_STEPS } from '@/types/assessment/navigation';

interface UseStepManagementProps {
  initialStep?: ValidStep;
  onComplete?: () => void;
  onError?: (error: Error) => void;
}

export function useStepManagement({
  initialStep = 'initial',
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

  const [stepStart] = useState(() => Date.now());
  const [validationAttempts, setValidationAttempts] = useState(0);

  const [stepValidation, setStepValidation] = useState<StepValidation>({
    isValid: true,
    errors: [],
    attempts: validationAttempts
  });

  // Calculate step navigation state
  const getStepNavigation = useCallback((): StepNavigation => {
    const currentIndex = VALID_STEPS.indexOf(currentStep as ValidStep);
    return {
      currentStep: currentStep as ValidStep,
      canGoNext: stepValidation.isValid && currentIndex < VALID_STEPS.length - 1,
      canGoBack: currentIndex > 0,
      currentStepIndex: currentIndex,
      totalSteps: VALID_STEPS.length,
      isComplete: currentStep === 'complete',
      timeSpent: Math.round((Date.now() - stepStart) / 1000) // Time spent in seconds
    };
  }, [currentStep, stepValidation.isValid, stepStart]);

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
        setValidationAttempts(prev => prev + 1);
        setStepValidation({
          isValid: false,
          errors: validation.errors.map(e => e.message),
          attempts: validationAttempts + 1
        });
        return;
      }

      // Clear any previous validation errors
      clearValidationErrors();
      setValidationAttempts(0);
      
      // Update step
      setStep(newStep);
      navigate(`/assessment/${newStep}`);

      telemetry.track('step_changed', {
        from: currentStep,
        to: newStep,
        duration: performanceMonitor.end(perfMark),
        validation_attempts: validationAttempts
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
        error: errorMessage,
        validation_attempts: validationAttempts
      });

      telemetry.track('step_change_failed', {
        from: currentStep,
        to: newStep,
        error: errorMessage,
        duration: performanceMonitor.end(perfMark),
        validation_attempts: validationAttempts
      });

      setError(errorMessage);
      onError?.(error instanceof Error ? error : new Error(errorMessage));
    }
  }, [
    currentStep,
    validateStep,
    clearValidationErrors,
    setStep,
    navigate,
    onComplete,
    onError,
    validationAttempts,
    performanceMonitor
  ]);

  // Handle step validation change
  const handleValidationChange = useCallback((isValid: boolean) => {
    if (!isValid) {
      setValidationAttempts(prev => prev + 1);
    }
    setStepValidation(prev => ({
      ...prev,
      isValid,
      attempts: validationAttempts + (isValid ? 0 : 1)
    }));
  }, [validationAttempts]);

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