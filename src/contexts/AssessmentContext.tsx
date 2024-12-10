import React, { createContext, useContext, useState } from 'react';
import type { AssessmentScores, AssessmentResults, IndustryAnalysis } from '@/types/calculator';

export interface AssessmentData {
  responses: Record<string, any>;
  currentStep: number;
  totalSteps: number;
  qualificationScore?: number;
  automationPotential?: number;
  sectionScores?: AssessmentScores;
  results?: AssessmentResults;
  industryAnalysis?: IndustryAnalysis;
  userInfo?: {
    name: string;
    email: string;
    phone: string;
  };
}

export interface AssessmentContextType {
  assessmentData: AssessmentData | null;
  setAssessmentData: (data: AssessmentData) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
}

const AssessmentContext = createContext<AssessmentContextType | undefined>(undefined);

export const AssessmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [assessmentData, setAssessmentData] = useState<AssessmentData | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

  console.log('Assessment Context - Current Data:', assessmentData);

  const handleSetAssessmentData = (data: AssessmentData) => {
    console.log('Setting assessment data:', data);
    setAssessmentData(data);
  };

  return (
    <AssessmentContext.Provider
      value={{
        assessmentData,
        setAssessmentData: handleSetAssessmentData,
        currentStep,
        setCurrentStep,
      }}
    >
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