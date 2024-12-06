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
import { calculateAutomationPotential } from '@/utils/calculations';
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

  const calculateResults = (responses: Record<string, any>) => {
    console.log('Calculating results for responses:', responses);
    const calculations = calculateAutomationPotential(responses);
    console.log('Raw calculation results:', calculations);

    return {
      score: calculations.efficiency.productivity,
      results: {
        annual: {
          hours: calculations.efficiency.timeReduction * 52,
          savings: calculations.savings.annual
        },
        automationPotential: calculations.efficiency.productivity
      }
    };
  };

  const handleAnswer = (questionId: string, answer: any) => {
    console.log('Handling answer:', { questionId, answer });
    
    const newResponses = assessmentData 
      ? { ...assessmentData.responses, [questionId]: answer }
      : { [questionId]: answer };

    console.log('New responses:', newResponses);
    
    // Calculate results immediately when we have responses
    const { score, results } = calculateResults(newResponses);
    console.log('Calculated results:', { score, results });

    const updatedData = {
      responses: newResponses,
      currentStep: currentStep,
      totalSteps: steps.length,
      completed: false,
      score,
      ...results
    };

    console.log('Setting assessment data:', updatedData);
    setAssessmentData(updatedData);

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
      const { results } = calculateResults(assessmentData?.responses || {});
      
      setAssessmentData(prev => prev ? {
        ...prev,
        completed: true,
        qualificationScore: score,
        ...results
      } : null);
      
      navigate('/assessment/report');
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