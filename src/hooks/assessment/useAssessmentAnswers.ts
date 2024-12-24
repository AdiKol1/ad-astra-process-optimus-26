import { useState } from 'react';
import { useAssessment } from '@/contexts/AssessmentContext';

export const useAssessmentAnswers = (currentStep: number, totalSteps: number) => {
  const { assessmentData, setAssessmentData } = useAssessment();
  const [showValueProp, setShowValueProp] = useState(false);

  const handleAnswer = (questionId: string, answer: any) => {
    if (!assessmentData) {
      setAssessmentData({
        responses: { [questionId]: answer },
        currentStep,
        totalSteps,
        completed: false
      });
      return;
    }
    
    const newResponses = {
      ...(assessmentData.responses || {}),
      [questionId]: answer
    };
    
    const updatedData = {
      ...assessmentData,
      responses: newResponses,
      currentStep,
      totalSteps,
      completed: false
    };

    setAssessmentData(updatedData);

    if (!showValueProp && currentStep === 0 && Object.keys(newResponses).length >= 1) {
      setShowValueProp(true);
    }
  };

  return { handleAnswer, showValueProp };
};