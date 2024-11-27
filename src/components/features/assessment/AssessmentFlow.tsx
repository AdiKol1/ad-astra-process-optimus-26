import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useAssessment } from '@/contexts/AssessmentContext';
import QuestionSection from './QuestionSection';
import ProgressBar from './ProgressBar';
import TrustIndicators from '@/components/shared/TrustIndicators';
import ValueMicroConversion from './ValueMicroConversion';
import { qualifyingQuestions } from '@/constants/questions/qualifying';
import { impactQuestions } from '@/constants/questions/impact';
import { readinessQuestions } from '@/constants/questions/readiness';
import { calculateQualificationScore } from '@/utils/qualificationScoring';

// Simplified steps focusing on key information
const steps = [
  { 
    id: 'qualifying', 
    Component: QuestionSection, 
    data: {
      ...qualifyingQuestions,
      questions: qualifyingQuestions.questions.slice(0, 2) // Only most important qualifying questions
    }
  },
  { 
    id: 'impact', 
    Component: QuestionSection, 
    data: {
      ...impactQuestions,
      questions: impactQuestions.questions.filter(q => 
        ['timeWasted', 'teamSize'].includes(q.id)
      )
    }
  },
  { 
    id: 'readiness', 
    Component: QuestionSection, 
    data: {
      ...readinessQuestions,
      questions: readinessQuestions.questions.filter(q => 
        ['decisionMaking', 'timeline'].includes(q.id)
      )
    }
  }
];

const AssessmentFlow = () => {
  const navigate = useNavigate();
  const { 
    assessmentData, 
    setAssessmentData, 
    currentStep, 
    setCurrentStep 
  } = useAssessment();
  const [showValueProp, setShowValueProp] = useState(false);

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

    // Show value proposition after first meaningful interaction
    if (!showValueProp && currentStep === 0 && Object.keys(newResponses).length >= 1) {
      setShowValueProp(true);
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      // Show encouraging toast message
      toast({
        title: "Great progress!",
        description: `You're getting closer to your personalized optimization plan.`,
        duration: 3000
      });
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
          <p className="text-sm text-gray-600 mt-2">
            {`${Math.round(((currentStep + 1) / steps.length) * 100)}% complete - Just ${steps.length - currentStep - 1} quick questions to go!`}
          </p>
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
          
          <Button 
            onClick={handleNext}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {currentStep === steps.length - 1 ? 'View Your Results' : 'Continue'}
          </Button>
        </div>
      </Card>

      {showValueProp && <ValueMicroConversion className="mt-8" />}
      <TrustIndicators className="mt-8" />
    </div>
  );
};

export default AssessmentFlow;