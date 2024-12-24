import { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAssessment } from '@/contexts/assessment/AssessmentContext';
import { qualifyingQuestions } from '@/constants/questions/qualifying';
import { impactQuestions } from '@/constants/questions/impact';
import { readinessQuestions } from '@/constants/questions/readiness';
import { cacQuestions } from '@/constants/questions/cac';
import { marketingQuestions } from '@/constants/questions/marketing';
import { teamQuestions } from '@/constants/questions/team';
import { logger } from '@/utils/logger';

export const useAssessmentSteps = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { state, setCurrentStep } = useAssessment();
  const [showValueProp, setShowValueProp] = useState(false);

  const steps = useMemo(() => [
    { 
      id: 'team',
      data: teamQuestions
    },
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
          ['timeWasted', 'errorImpact'].includes(q.id)
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
      data: readinessQuestions
    }
  ], []);

  const handleNext = useCallback(() => {
    const nextStep = state.currentStep + 1;
    
    if (nextStep < steps.length) {
      logger.info('Moving to next step', { from: state.currentStep, to: nextStep });
      // Wrap in Promise to ensure clean state update
      Promise.resolve().then(() => {
        setCurrentStep(nextStep);
      });
    } else {
      // Handle completion
      logger.info('Assessment completed, navigating to results');
      navigate('/assessment/results');
    }
  }, [steps.length, setCurrentStep, navigate, state.currentStep]);

  const handleBack = useCallback(() => {
    const prevStep = state.currentStep - 1;
    if (prevStep >= 0) {
      logger.info('Moving to previous step', { from: state.currentStep, to: prevStep });
      Promise.resolve().then(() => {
        setCurrentStep(prevStep);
      });
    }
  }, [setCurrentStep, state.currentStep]);

  return useMemo(() => ({
    steps,
    currentStep: state.currentStep,
    handleNext,
    handleBack,
    showValueProp,
    setShowValueProp
  }), [
    steps,
    state.currentStep,
    handleNext,
    handleBack,
    showValueProp,
    setShowValueProp
  ]);
};