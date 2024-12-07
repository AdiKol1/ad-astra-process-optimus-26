import React, { createContext, useContext, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

interface AssessmentData {
  responses: Record<string, any>;
  currentStep: number;
  totalSteps: number;
  completed: boolean;
  scores?: {
    process: number;
    marketing: number;
    overall: number;
  };
}

interface AssessmentContextType {
  assessmentData: AssessmentData | null;
  setAssessmentData: (data: AssessmentData | null) => void;
  updateResponses: (responses: Record<string, any>) => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  isLastStep: boolean;
  currentStepPath: string;
}

const AssessmentContext = createContext<AssessmentContextType | undefined>(undefined);

const STEP_PATHS = [
  '/',
  '/processes',
  '/marketing',
  '/capture',
  '/report'
];

export const AssessmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const [assessmentData, setAssessmentData] = useState<AssessmentData | null>(null);

  const updateResponses = useCallback((newResponses: Record<string, any>) => {
    setAssessmentData(prev => prev ? {
      ...prev,
      responses: {
        ...prev.responses,
        ...newResponses
      }
    } : null);
  }, []);

  const goToNextStep = useCallback(() => {
    setAssessmentData(prev => {
      if (!prev) return null;
      const nextStep = prev.currentStep + 1;
      if (nextStep < STEP_PATHS.length) {
        navigate(`/assessment${STEP_PATHS[nextStep]}`);
        return {
          ...prev,
          currentStep: nextStep
        };
      }
      return prev;
    });
  }, [navigate]);

  const goToPreviousStep = useCallback(() => {
    setAssessmentData(prev => {
      if (!prev || prev.currentStep === 0) return prev;
      const prevStep = prev.currentStep - 1;
      navigate(`/assessment${STEP_PATHS[prevStep]}`);
      return {
        ...prev,
        currentStep: prevStep
      };
    });
  }, [navigate]);

  const value = {
    assessmentData,
    setAssessmentData,
    updateResponses,
    goToNextStep,
    goToPreviousStep,
    isLastStep: assessmentData?.currentStep === STEP_PATHS.length - 1,
    currentStepPath: assessmentData ? STEP_PATHS[assessmentData.currentStep] : STEP_PATHS[0]
  };

  return (
    <AssessmentContext.Provider value={value}>
      {children}
    </AssessmentContext.Provider>
  );
};

export const useAssessment = () => {
  const context = useContext(AssessmentContext);
  if (!context) {
    throw new Error('useAssessment must be used within an AssessmentProvider');
  }
  return context;
};

export default AssessmentContext;