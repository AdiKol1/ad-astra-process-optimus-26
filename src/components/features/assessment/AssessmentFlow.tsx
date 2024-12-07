import React from 'react';
import { useAssessment } from '@/contexts/AssessmentContext';
import QuestionSection from './QuestionSection';
import NavigationControls from './flow/NavigationControls';
import type { AssessmentStep } from '@/types/assessment';

interface AssessmentFlowProps {
  currentStep?: number;
  steps?: AssessmentStep[];
}

const AssessmentFlow: React.FC<AssessmentFlowProps> = ({ 
  currentStep = 0, 
  steps = [] 
}) => {
  const { assessmentData } = useAssessment();
  
  console.log('AssessmentFlow rendering with:', { 
    currentStep, 
    stepsCount: steps?.length,
    steps 
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
        step={currentStepData}
        stepIndex={currentStep}
      />
      <NavigationControls 
        currentStep={currentStep}
        totalSteps={steps.length}
        onNext={() => console.log('Next step')}
        onBack={() => console.log('Previous step')}
      />
    </div>
  );
};

export default AssessmentFlow;