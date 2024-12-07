import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAssessment } from '@/contexts/AssessmentContext';
import TrustIndicators from '@/components/shared/TrustIndicators';
import ValueMicroConversion from './ValueMicroConversion';
import { qualifyingQuestions } from '@/constants/questions/qualifying';
import { impactQuestions } from '@/constants/questions/impact';
import { readinessQuestions } from '@/constants/questions/readiness';
import { cacQuestions } from '@/constants/questions/cac';
import { marketingQuestions } from '@/constants/questions/marketing';
import { calculateQualificationScore } from '@/utils/qualificationScoring';
import { transformAuditFormData } from '@/utils/assessmentFlow';
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
    id: 'marketing',
    data: marketingQuestions
  },
  {
    id: 'cac',
    data: cacQuestions
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

console.log('Assessment steps configured:', steps);

const AssessmentFlow = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { 
    assessmentData, 
    setAssessmentData, 
    currentStep, 
    setCurrentStep 
  } = useAssessment();
  const [showValueProp, setShowValueProp] = useState(false);

  console.log('AssessmentFlow - Current step:', currentStep);
  console.log('AssessmentFlow - Assessment data:', assessmentData);

  const handleAnswer = (questionId: string, answer: any) => {
    console.log('Handling answer:', { questionId, answer });
    
    if (!assessmentData) {
      console.log('No assessment data available, creating initial state');
      setAssessmentData({
        responses: { [questionId]: answer },
        currentStep,
        totalSteps: steps.length,
        completed: false
      });
      return;
    }
    
    const newResponses = {
      ...(assessmentData.responses || {}),
      [questionId]: answer
    };

    console.log('New responses:', newResponses);
    
    const updatedData = {
      ...assessmentData,
      responses: newResponses,
      currentStep: currentStep,
      totalSteps: steps.length,
      completed: false
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
      
      // Map final responses to audit form format
      const mappedData = {
        industry: assessmentData?.responses?.industry || '',
        employees: String(assessmentData?.responses?.teamSize || ''),
        processVolume: assessmentData?.responses?.processVolume || '',
        timelineExpectation: assessmentData?.responses?.timeline || '',
        marketingChallenges: assessmentData?.responses?.marketingChallenges || [],
        toolStack: assessmentData?.responses?.toolStack || [],
        metricsTracking: assessmentData?.responses?.metricsTracking || [],
        automationLevel: assessmentData?.responses?.automationLevel || '0-25%',
        name: '',
        email: '',
        phone: ''
      };

      console.log('Final mapped data for transformation:', mappedData);
      
      // Transform final responses using existing utility
      const transformedData = transformAuditFormData(mappedData);
      console.log('Final transformed data:', transformedData);
      
      const finalData = {
        ...assessmentData,
        ...transformedData,
        completed: true,
        qualificationScore: score
      };

      console.log('Final assessment data being set:', finalData);
      setAssessmentData(finalData);
      
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
      <div className="p-6">
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
      </div>

      {showValueProp && <ValueMicroConversion className="mt-8" />}
      <TrustIndicators className="mt-8" />
    </div>
  );
};

export default AssessmentFlow;