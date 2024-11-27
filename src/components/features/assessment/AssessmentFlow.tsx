import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useAssessment } from '@/contexts/AssessmentContext';
import QuestionSection from './QuestionSection';
import ProgressBar from './ProgressBar';
import TrustIndicators from '@/components/shared/TrustIndicators';
import { qualifyingQuestions } from '@/constants/questions/qualifying';
import { impactQuestions } from '@/constants/questions/impact';
import { readinessQuestions } from '@/constants/questions/readiness';
import { calculateQualificationScore } from '@/utils/qualificationScoring';

const steps = [
  { id: 'qualifying', Component: QuestionSection, data: qualifyingQuestions },
  { id: 'impact', Component: QuestionSection, data: impactQuestions },
  { id: 'readiness', Component: QuestionSection, data: readinessQuestions }
];

const AssessmentFlow = () => {
  const navigate = useNavigate();
  const { 
    assessmentData, 
    setAssessmentData, 
    currentStep, 
    setCurrentStep 
  } = useAssessment();

  const handleAnswer = (questionId: string, answer: any) => {
    if (!assessmentData) {
      setAssessmentData({
        responses: { [questionId]: answer },
        currentStep: 0,
        completed: false
      });
      return;
    }

    const newResponses = { 
      ...assessmentData.responses, 
      [questionId]: answer 
    };

    setAssessmentData({
      ...assessmentData,
      responses: newResponses,
    });
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      const score = calculateQualificationScore(assessmentData?.responses || {});
      setAssessmentData(prev => prev ? {
        ...prev,
        completed: true,
        qualificationScore: score
      } : null);
      navigate('/assessment/results');
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const CurrentStepComponent = steps[currentStep]?.Component;

  if (!CurrentStepComponent) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card className="p-6">
        <div className="mb-8">
          <ProgressBar 
            currentStep={currentStep} 
            totalSteps={steps.length} 
          />
        </div>

        <CurrentStepComponent
          section={steps[currentStep].data}
          onAnswer={handleAnswer}
          answers={assessmentData?.responses || {}}
        />

        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 0}
          >
            Back
          </Button>
          
          <Button onClick={handleNext}>
            {currentStep === steps.length - 1 ? 'View Results' : 'Next'}
          </Button>
        </div>
      </Card>

      <TrustIndicators className="mt-8" />
    </div>
  );
};

export default AssessmentFlow;