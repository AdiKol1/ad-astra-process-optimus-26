import React from 'react';
import { useAssessment } from '@/contexts/AssessmentContext';
import QuestionSection from './QuestionSection';
import NavigationControls from './flow/NavigationControls';
import { useAssessmentSteps } from '@/hooks/useAssessmentSteps';
import { AssessmentErrorBoundary } from './AssessmentErrorBoundary';
import { useToast } from '@/hooks/use-toast';
import type { AssessmentStep } from '@/types/assessmentFlow';

interface AssessmentFlowProps {
  currentStep?: number;
  steps?: AssessmentStep[];
}

const AssessmentFlow: React.FC<AssessmentFlowProps> = () => {
  const { toast } = useToast();
  const { assessmentData } = useAssessment();
  const { steps, currentStep, handleAnswer, handleNext, handleBack } = useAssessmentSteps();
  
  // Type checking verification logs
  console.log('TypeScript Configuration Test:', {
    currentStep: typeof currentStep,
    stepsLength: steps?.length,
    assessmentDataType: typeof assessmentData,
    stepsType: Array.isArray(steps) ? 'Array' : typeof steps
  });

  if (!steps || steps.length === 0) {
    console.warn('No steps provided to AssessmentFlow');
    toast({
      title: "Configuration Error",
      description: "Assessment steps could not be loaded. Please try again.",
      variant: "destructive",
    });
    return null;
  }

  const currentStepData = steps[currentStep];

  if (!currentStepData) {
    console.warn(`Invalid step index: ${currentStep}`);
    toast({
      title: "Navigation Error",
      description: "Invalid assessment step. Redirecting to start.",
      variant: "destructive",
    });
    return null;
  }

  const handleError = (error: Error) => {
    console.error('Assessment Error:', error);
    toast({
      title: "Error",
      description: "An error occurred while processing your response. Please try again.",
      variant: "destructive",
    });
  };

  return (
    <AssessmentErrorBoundary>
      <div className="space-y-6">
        <QuestionSection 
          section={currentStepData.data}
          onAnswer={handleAnswer}
          answers={assessmentData?.responses || {}}
          onError={handleError}
        />
        <NavigationControls 
          currentStep={currentStep}
          totalSteps={steps.length}
          onNext={handleNext}
          onBack={handleBack}
        />
      </div>
    </AssessmentErrorBoundary>
  );
};

export default AssessmentFlow;