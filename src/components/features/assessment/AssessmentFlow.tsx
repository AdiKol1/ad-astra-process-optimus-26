import React from 'react';
import { useAssessment } from '@/contexts/AssessmentContext';
import QuestionSection from './QuestionSection';
import NavigationControls from './flow/NavigationControls';
import { useAssessmentSteps } from '@/hooks/useAssessmentSteps';
import type { AssessmentStep } from '@/types/assessmentFlow';

interface AssessmentFlowProps {
  currentStep?: number;
  steps?: AssessmentStep[];
}

const AssessmentFlow: React.FC<AssessmentFlowProps> = () => {
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
    return null;
  }

  const currentStepData = steps[currentStep];

  if (!currentStepData) {
    console.warn(`Invalid step index: ${currentStep}`);
    return null;
  }

  return (
    <div className="space-y-6">
      <QuestionSection 
        section={currentStepData.data}
        onAnswer={handleAnswer}
        answers={assessmentData?.responses || {}}
      />
      <NavigationControls 
        currentStep={currentStep}
        totalSteps={steps.length}
        onNext={handleNext}
        onBack={handleBack}
      />
    </div>
  );
};

export default AssessmentFlow;