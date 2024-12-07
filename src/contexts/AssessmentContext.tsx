import React, { createContext, useContext, useState } from 'react';

export interface AssessmentContextType {
  assessmentData: AssessmentData | null;
  setAssessmentData: (data: AssessmentData) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
}

export interface AssessmentData {
  processDetails: {
    employees: number;
    processVolume: string;
    industry: string;
    timeline: string;
  };
  technology: {
    currentSystems: string[];
    integrationNeeds: string[];
  };
  processes: {
    manualProcesses: string[];
    timeSpent: number;
    errorRate: string;
  };
  team: {
    teamSize: number;
    departments: string[];
  };
  challenges: {
    painPoints: string[];
    priority: string;
  };
  goals: {
    objectives: string[];
    expectedOutcomes: string[];
  };
  results?: {
    annual: {
      savings: number;
      hours: number;
    };
    automationPotential: number;
    roi: number;
  };
}

const AssessmentContext = createContext<AssessmentContextType | undefined>(undefined);

export const AssessmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [assessmentData, setAssessmentData] = useState<AssessmentData | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

  console.log('Assessment Context - Current Data:', assessmentData);

  return (
    <AssessmentContext.Provider
      value={{
        assessmentData,
        setAssessmentData,
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