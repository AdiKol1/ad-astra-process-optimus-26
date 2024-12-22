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

  const safeHandleAnswer = (questionId: string, answer: any) => {
    console.log('Handling answer:', { questionId, answer });
    try {
      if (typeof handleAnswer === 'function') {
        handleAnswer(questionId, answer);
      } else {
        console.error('handleAnswer is not a function:', handleAnswer);
      }
    } catch (error) {
      console.error('Error in handleAnswer:', error);
    }
  };

  return (
    <div className="space-y-6">
      <QuestionSection 
        section={currentStepData.data}
        onAnswer={safeHandleAnswer}
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