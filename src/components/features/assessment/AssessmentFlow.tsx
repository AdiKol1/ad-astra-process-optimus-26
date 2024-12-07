import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { useAssessment } from '@/contexts/AssessmentContext';
import TrustIndicators from '@/components/shared/TrustIndicators';
import ValueMicroConversion from './ValueMicroConversion';
import { qualifyingQuestions } from '@/constants/questions/qualifying';
import { impactQuestions } from '@/constants/questions/impact';
import { readinessQuestions } from '@/constants/questions/readiness';
import { calculateQualificationScore } from '@/utils/qualificationScoring';
import StepProgress from './flow/StepProgress';
import QuestionRenderer from './flow/QuestionRenderer';
import NavigationControls from './flow/NavigationControls';

const steps = [
  { 
    id: 'qualifying', 
    data: {
      ...qualifyingQuestions,
      questions: qualifyingQuestions.questions.slice(0, 2)
    }
  },
  { 
    id: 'impact', 
    data: {
      ...impactQuestions,
      questions: impactQuestions.questions.filter(q => 
        ['timeWasted', 'teamSize'].includes(q.id)
      )
    }
  },
  { 
    id: 'readiness', 
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
        totalSteps: steps.length,
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

    if (!showValueProp && currentStep === 0 && Object.keys(newResponses).length >= 1) {
      setShowValueProp(true);
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      toast({
        title: "Great progress!",
        description: "You're getting closer to your personalized optimization plan.",
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

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card className="p-6">
        <StepProgress 
          currentStep={currentStep} 
          totalSteps={steps.length} 
        />

        <QuestionRenderer
          section={steps[currentStep]?.data}
          onAnswer={handleAnswer}
          answers={assessmentData?.responses || {}}
        />

        <NavigationControls
          onNext={handleNext}
          onBack={handleBack}
          currentStep={currentStep}
          totalSteps={steps.length}
        />
      </Card>

      {showValueProp && <ValueMicroConversion className="mt-8" />}
      <TrustIndicators className="mt-8" />
    </div>
  );
};

export default AssessmentFlow;