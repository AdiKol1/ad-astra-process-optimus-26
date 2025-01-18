import { useState } from 'react';
import { useAssessment } from '@/contexts/assessment/AssessmentContext';
import type { AssessmentState } from '@/types/assessment';

export const useAssessmentAnswers = (currentStep: number, totalSteps: number) => {
  const { state, setAssessmentData } = useAssessment();
  const [showValueProp, setShowValueProp] = useState(false);

  const handleAnswer = (questionId: string, answer: any) => {
    if (!state) {
      const initialState: AssessmentState = {
        responses: { [questionId]: answer },
        currentStep,
        totalSteps,
        completed: false
      };
      setAssessmentData(initialState);
      return;
    }
    
    const newResponses = {
      ...(state.responses || {}),
      [questionId]: answer
    };
    
    setAssessmentData({
      ...state,
      responses: newResponses,
      completed: false
    });

    if (!showValueProp && currentStep === 0 && Object.keys(newResponses).length >= 1) {
      setShowValueProp(true);
    }
  };

  return { handleAnswer, showValueProp };
};