import React, { createContext, useContext, useState } from 'react';

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
  results: {
    annual: {
      savings: number;
      hours: number;
    };
    automationPotential: number;
    roi: number;
    qualificationScore: number;
    sectionScores: {
      [key: string]: number;  // For dynamic section scoring
    };
  };
  industryAnalysis: {
    benchmarks: {
      averageAutomation: number;
      topPerformerAutomation: number;
    };
    recommendations: string[];
    risks: string[];
    opportunities: string[];
  };
  responses?: Record<string, any>; // Keep existing responses field
  userInfo?: {
    name: string;
    email: string;
    phone?: string;
  };
  qualificationScore?: number; // Keep for backward compatibility
  automationPotential?: number; // Keep for backward compatibility
  sectionScores?: Record<string, { percentage: number }>; // Keep for backward compatibility
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