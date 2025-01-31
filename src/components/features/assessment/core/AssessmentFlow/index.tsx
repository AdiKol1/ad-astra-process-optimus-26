import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { useAssessmentStore } from '@/stores/assessment';
import { ErrorBoundary } from '@/components/error/ErrorBoundary';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { logger } from '@/utils/logger';
import { VALID_STEPS, type Step, isValidStep, type StepComponentProps } from './types';
import { useStepManagement } from './useStepManagement';
import type { AssessmentStep } from '@/types/assessment/state';
import {
  ProcessesSection,
  TechnologySection,
  TeamSection,
  LandingSection,
  ResultsSection
} from '@/components/features/assessment/sections';
import { telemetry } from '@/utils/monitoring/telemetry';

// Create a wrapper component to handle the complete step
const CompleteStep: React.FC<StepComponentProps> = ({ onNext }) => {
  React.useEffect(() => {
    onNext();
  }, [onNext]);
  return null;
};

const StepComponents = {
  initial: LandingSection,
  process: ProcessesSection,
  technology: TechnologySection,
  team: TeamSection,
  results: ResultsSection,
  complete: CompleteStep
} as const;

export const AssessmentFlow: React.FC = () => {
  const navigate = useNavigate();
  const { step: urlStep = 'initial' } = useParams();
  const step = isValidStep(urlStep) ? urlStep : 'initial';
  
  const {
    currentStep,
    setStep,
    validateStep,
    clearValidationErrors,
    validationErrors,
    isLoading,
    error
  } = useAssessmentStore();

  const {
    stepValidation,
    navigation,
    onStepChange,
    onValidationChange,
    onBack
  } = useStepManagement({
    initialStep: isValidStep(step) ? step : 'initial',
    onComplete: () => navigate('/assessment/report'),
    onError: (err: Error) => {
      logger.error('Step management error', {
        component: 'AssessmentFlow',
        error: err,
        step: currentStep
      });
      navigate('/assessment/initial');
    }
  });

  // Handle step transitions
  const handleStepTransition = React.useCallback(async (nextStep: Step) => {
    try {
      // Validate current step
      const validation = validateStep(currentStep);
      if (!validation.isValid) {
        onValidationChange(false);
        logger.warn('Step validation failed', {
          component: 'AssessmentFlow',
          step: currentStep,
          errors: validation.errors
        });
        return;
      }

      // Clear validation errors and proceed
      clearValidationErrors();
      setStep(nextStep); // Update store first
      navigate(`/assessment/${nextStep}`); // Navigate to next step
    } catch (err) {
      logger.error('Step transition failed', {
        component: 'AssessmentFlow',
        error: err,
        from: currentStep,
        to: nextStep
      });
    }
  }, [currentStep, validateStep, clearValidationErrors, setStep, navigate, onValidationChange]);

  // Sync URL with current step
  React.useEffect(() => {
    if (step && step !== currentStep && isValidStep(step)) {
      handleStepTransition(step);
    }
  }, [step, currentStep, handleStepTransition]);

  // Validate current step and update URL if needed
  useEffect(() => {
    if (!isValidStep(step)) {
      logger.warn('Invalid step detected, redirecting to initial', { step });
      navigate('/assessment/initial', { replace: true });
      return;
    }

    if (step !== currentStep) {
      setStep(step);
    }
  }, [step, currentStep, navigate, setStep]);

  // Track step views
  useEffect(() => {
    if (!isLoading && isValidStep(currentStep)) {
      const validation = validateStep(currentStep);
      
      telemetry.track('step_view', {
        step_name: currentStep,
        is_valid: validation.isValid,
        has_errors: validationErrors.length > 0
      });
    }
  }, [currentStep, isLoading, validateStep, validationErrors]);

  // Clear validation errors when changing steps
  useEffect(() => {
    clearValidationErrors();
  }, [currentStep, clearValidationErrors]);

  if (error) {
    logger.error('Assessment store error', {
      component: 'AssessmentFlow',
      error,
      step: currentStep
    });
    return (
      <div className="text-red-600 p-4 rounded-lg bg-red-50" role="alert">
        An error occurred while loading the assessment. Please try again.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <LoadingSpinner />
      </div>
    );
  }

  const validStep = isValidStep(currentStep) ? currentStep : 'initial';
  const StepComponent = StepComponents[validStep as keyof typeof StepComponents];
  if (!StepComponent) {
    logger.error('Invalid assessment step', {
      component: 'AssessmentFlow',
      step: currentStep,
      availableSteps: Object.keys(StepComponents)
    });
    navigate('/assessment/initial');
    return null;
  }

  return (
    <ErrorBoundary>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="p-6">
          {/* Progress indicator */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">
                Step {navigation.currentStepIndex + 1} of {VALID_STEPS.length}
              </h2>
              {!stepValidation.isValid && (
                <p className="text-destructive">
                  Please fix validation errors before proceeding
                </p>
              )}
            </div>

            {/* Progress bar */}
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all"
                style={{
                  width: `${((navigation.currentStepIndex + 1) / VALID_STEPS.length) * 100}%`
                }}
              />
            </div>
          </div>

          {/* Step content */}
          <div className="mb-8">
            <StepComponent
              step={validStep}
              onValidationChange={onValidationChange}
              onNext={() => {
                const nextIndex = navigation.currentStepIndex + 1;
                if (nextIndex < VALID_STEPS.length) {
                  const nextStep = VALID_STEPS[nextIndex];
                  handleStepTransition(nextStep);
                }
              }}
              onBack={() => {
                if (navigation.canGoBack) {
                  const prevStep = VALID_STEPS[navigation.currentStepIndex - 1];
                  setStep(prevStep);
                  navigate(`/assessment/${prevStep}`);
                }
              }}
              isLoading={isLoading}
            />
          </div>
        </Card>
      </div>
    </ErrorBoundary>
  );
};
