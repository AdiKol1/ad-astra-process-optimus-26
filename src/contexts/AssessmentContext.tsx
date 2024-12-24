import React, { createContext, useContext, useState } from 'react';
import type { AssessmentData } from '@/types/assessmentTypes';

interface AssessmentContextType {
  assessmentData: AssessmentData | null;
  setAssessmentData: (data: AssessmentData | null) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
}

const initialState: AssessmentData = {
  responses: {},
  currentStep: 0,
  totalSteps: 0
};

const AssessmentContext = createContext<AssessmentContextType>({
  assessmentData: initialState,
  setAssessmentData: () => {},
  currentStep: 0,
  setCurrentStep: () => {}
});

export const AssessmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [assessmentData, setAssessmentData] = useState<AssessmentData | null>(initialState);
  const [currentStep, setCurrentStep] = useState(0);

  console.log('AssessmentProvider rendering with:', { assessmentData, currentStep });

  const value = {
    assessmentData,
    setAssessmentData,
    currentStep,
    setCurrentStep
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