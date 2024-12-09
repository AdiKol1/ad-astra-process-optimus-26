import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAssessment } from '@/contexts/AssessmentContext';
import QuestionSection from './QuestionSection';
import NavigationControls from './flow/NavigationControls';
import { useAssessmentSteps } from '@/hooks/useAssessmentSteps';
import type { AssessmentStep } from '@/types/assessment';
import { toast } from '@/hooks/use-toast';

interface AssessmentFlowProps {
  currentStep?: number;
  steps?: AssessmentStep[];
}

const AssessmentFlow: React.FC<AssessmentFlowProps> = () => {
  const navigate = useNavigate();
  const { assessmentData, setAssessmentData } = useAssessment();
  const { steps, currentStep, handleAnswer, handleNext, handleBack } = useAssessmentSteps();
  
  console.log('AssessmentFlow rendering with:', { 
    currentStep, 
    stepsCount: steps?.length,
    steps,
    assessmentData 
  });

  React.useEffect(() => {
    // Redirect to home if no assessment data
    if (!assessmentData && !steps?.length) {
      console.log('No assessment data or steps available, redirecting');
      toast({
        title: "Assessment Error",
        description: "Unable to load assessment. Please try again.",
        variant: "destructive"
      });
      navigate('/');
      return;
    }
  }, [assessmentData, steps, navigate]);

  if (!steps || steps.length === 0) {
    console.warn('No steps provided to AssessmentFlow');
    return null;
  }

  const currentStepData = steps[currentStep];

  if (!currentStepData) {
    console.warn(`Invalid step index: ${currentStep}`);
    return null;
  }

  const handleAnswerWithValidation = (questionId: string, answer: any) => {
    console.log('Handling answer:', { questionId, answer });
    handleAnswer(questionId, answer);
  };

  const handleNextWithValidation = () => {
    console.log('Handling next step:', { currentStep, totalSteps: steps.length });
    handleNext();
  };

  const handleBackWithValidation = () => {
    console.log('Handling back step:', { currentStep });
    handleBack();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto px-4 py-8">
      <QuestionSection 
        section={currentStepData.data}
        onAnswer={handleAnswerWithValidation}
        answers={assessmentData?.responses || {}}
      />
      
      <NavigationControls 
        currentStep={currentStep}
        totalSteps={steps.length}
        onNext={handleNextWithValidation}
        onBack={handleBackWithValidation}
      />
    </div>
  );
};

export default AssessmentFlow;