import React, { useEffect, useState } from 'react';
import { useAssessmentStore } from '@/contexts/assessment/store';
import { STEP_CONFIG, STEP_ORDER, type AssessmentStep } from '@/types/assessment/steps';
import type { StepMetadata } from '@/types/assessment/metadata';
import type { ValidationError } from '@/types/assessment/state';
import { LandingSection } from '@/components/features/assessment/sections';
import LeadCaptureSection from '@/components/features/assessment/sections/LeadCaptureSection';
import ProcessSection from '@/components/features/assessment/sections/ProcessSection';
import TechnologySection from '@/components/features/assessment/sections/TechnologySection';
import TeamSection from '@/components/features/assessment/sections/TeamSection';
import SocialMediaSection from '@/components/features/assessment/sections/SocialMediaSection';
import DetailedResultsSection from '@/components/features/assessment/sections/DetailedResultsSection';
import CompletionSection from '@/components/features/assessment/sections/CompletionSection';
import { ProgressReward } from '@/components/features/assessment/micro-rewards/ProgressReward';
import { telemetry } from '@/utils/monitoring/telemetry';
import ScrollToTop from '@/components/shared/ScrollToTop';

export interface BaseStepComponentProps {
  step: AssessmentStep;
  metadata: StepMetadata;
  onNext: () => void;
  onBack: () => void;
  onComplete: () => void;
  onValidationChange: (isValid: boolean) => void;
  isValid: boolean;
  isLoading: boolean;
  validationErrors: ValidationError[];
  responses?: Record<string, any>;
}

type StepComponent = React.ComponentType<BaseStepComponentProps>;

const StepComponents: Record<AssessmentStep, StepComponent> = {
  'initial': LandingSection as unknown as StepComponent,
  'lead-capture': LeadCaptureSection as unknown as StepComponent,
  'process': ProcessSection as unknown as StepComponent,
  'technology': TechnologySection as unknown as StepComponent,
  'team': TeamSection as unknown as StepComponent,
  'social-media': SocialMediaSection as unknown as StepComponent,
  'detailed-results': DetailedResultsSection as unknown as StepComponent,
  'complete': CompletionSection as unknown as StepComponent
};

export const AssessmentFlow: React.FC = () => {
  const { 
    currentStep, 
    setStep, 
    completeStep,
    isLoading,
    validationErrors = [],
    responses = {},
    stepHistory = []
  } = useAssessmentStore();
  
  const [isValid, setIsValid] = React.useState(true);
  const [prevStep, setPrevStep] = useState<AssessmentStep | null>(null);
  
  // Track when a step has been completed
  useEffect(() => {
    if (prevStep && prevStep !== currentStep) {
      // If we've moved to a new step, the previous step was completed
      telemetry.track('step_completed', {
        completedStep: prevStep,
        nextStep: currentStep,
        timestamp: new Date().toISOString()
      });
    }
    
    setPrevStep(currentStep);
  }, [currentStep, prevStep]);
  
  const handleNext = React.useCallback(() => {
    const currentIndex = STEP_ORDER.indexOf(currentStep);
    if (currentIndex < STEP_ORDER.length - 1) {
      setStep(STEP_ORDER[currentIndex + 1]);
    }
  }, [currentStep, setStep]);

  const handleBack = React.useCallback(() => {
    const currentIndex = STEP_ORDER.indexOf(currentStep);
    if (currentIndex > 0) {
      setStep(STEP_ORDER[currentIndex - 1]);
    }
  }, [currentStep, setStep]);

  const handleComplete = React.useCallback(() => {
    completeStep(currentStep);
  }, [completeStep, currentStep]);

  const handleValidationChange = React.useCallback((isValid: boolean) => {
    setIsValid(isValid);
  }, []);

  const CurrentStepComponent = StepComponents[currentStep];
  const metadata = STEP_CONFIG[currentStep];
  
  // Calculate completed steps count for progress rewards
  const completedStepsCount = stepHistory.length > 0 ? stepHistory.length - 1 : 0;

  if (!CurrentStepComponent || !metadata) {
    console.error(`No component or metadata found for step: ${currentStep}`);
    return null;
  }

  const stepProps: BaseStepComponentProps = {
    step: currentStep,
    metadata,
    onNext: handleNext,
    onBack: handleBack,
    onComplete: handleComplete,
    onValidationChange: handleValidationChange,
    isValid,
    isLoading,
    validationErrors,
    responses
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Ensure ScrollToTop works within the assessment */}
      <ScrollToTop />
      
      {/* Add the ProgressReward component to show rewards when steps are completed */}
      <ProgressReward 
        step={currentStep}
        completedStepsCount={completedStepsCount}
        totalSteps={STEP_ORDER.length - 1} // Subtract 1 to exclude 'initial'
      />
      
      <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
        <CurrentStepComponent {...stepProps} />
      </main>
    </div>
  );
};

export default AssessmentFlow;
