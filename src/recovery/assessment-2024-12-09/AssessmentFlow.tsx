import React from 'react';
import { useAssessment } from '@/contexts/AssessmentContext';
import QuestionSection from './QuestionSection';
import NavigationControls from './flow/NavigationControls';
import { useAssessmentSteps } from '@/hooks/useAssessmentSteps';
import type { AssessmentStep } from '@/types/assessment';

const AssessmentFlow: React.FC = () => {
  const { assessmentData } = useAssessment();
  const { steps, currentStep, handleAnswer, handleNext, handleBack } = useAssessmentSteps();
  
  console.log('AssessmentFlow rendering with:', { 
    currentStep, 
    stepsCount: steps?.length,
    steps,
    assessmentData 
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
