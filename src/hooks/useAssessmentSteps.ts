import { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../components/ui';
import { useAssessment } from './useAssessment';
import { qualifyingQuestions } from '../constants/questions/qualifying';
import { impactQuestions } from '../constants/questions/impact';
import { readinessQuestions } from '../constants/questions/readiness';
import { cacQuestions } from '../constants/questions/cac';
import { marketingQuestions } from '../constants/questions/marketing';
import { teamQuestions } from '../constants/questions/team';
import { logger } from '../utils/logger';
import { calculateProcessMetrics } from '../utils/assessment/process/calculations';
import { AssessmentData, AssessmentResponses } from '../types/assessment';
import { QuestionSection } from '../types/questions';

export const useAssessmentSteps = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { state, setCurrentStep, setAssessmentData, completeAssessment } = useAssessment();
  const [showValueProp, setShowValueProp] = useState(false);

  const steps = useMemo<QuestionSection[]>(() => [
    teamQuestions,
    { 
      ...qualifyingQuestions,
      questions: qualifyingQuestions.questions.slice(0, 2)
    },
    { 
      ...impactQuestions,
      questions: impactQuestions.questions.filter(q => 
        ['timeWasted', 'errorImpact'].includes(q.id)
      )
    },
    marketingQuestions,
    cacQuestions,
    readinessQuestions
  ], []);


  const validateStep = useCallback((stepIndex: number) => {
    const currentStep = steps[stepIndex];
    if (!currentStep) return false;

    const requiredQuestions = currentStep.questions.filter(q => q.required);
    if (requiredQuestions.length === 0) return true;

    return requiredQuestions.every(question => {
      const answer = state.responses[question.id as keyof AssessmentResponses];
      if (answer === undefined) return false;
      if (Array.isArray(answer)) return answer.length > 0;
      return answer !== '';
    });
  }, [steps, state.responses]);

  const handleNext = useCallback(async () => {
    try {
      const nextStep = state.currentStep + 1;
      
      // Validate current step before moving
      if (!validateStep(state.currentStep)) {
        toast({
          title: 'Required Fields',
          description: 'Please fill in all required fields before proceeding.',
          variant: 'destructive',
        });
        return;
      }
      
      if (nextStep < steps.length) {
        logger.info('Moving to next step', { from: state.currentStep, to: nextStep });
        await setCurrentStep(nextStep);
      } else {
        logger.info('Assessment completed, calculating results');
        
        // Validate all steps before completion
        const allStepsValid = Array.from({ length: steps.length }, (_, i) => i)
          .every(stepIndex => validateStep(stepIndex));

        if (!allStepsValid) {
          toast({
            title: 'Validation Error',
            description: 'Please ensure all required fields are filled before completing.',
            variant: 'destructive',
          });
          return;
        }

        await completeAssessment();
      }
    } catch (error) {
      logger.error('Error during step navigation:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to proceed. Please try again.',
        variant: 'destructive',
      });
    }
  }, [steps.length, state.currentStep, validateStep, setCurrentStep, completeAssessment, toast]);

  const handleBack = useCallback(async () => {
    try {
      const prevStep = state.currentStep - 1;
      if (prevStep >= 0) {
        logger.info('Moving to previous step', { from: state.currentStep, to: prevStep });
        await setCurrentStep(prevStep);
      }
    } catch (error) {
      logger.error('Error during step navigation:', error);
      toast({
        title: 'Error',
        description: 'Failed to go back. Please try again.',
        variant: 'destructive',
      });
    }
  }, [setCurrentStep, state.currentStep, toast]);

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
