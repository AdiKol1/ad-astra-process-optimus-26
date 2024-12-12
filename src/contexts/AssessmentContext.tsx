import React, { createContext, useContext, useState } from 'react';
import type { AssessmentScores, AssessmentResults, IndustryAnalysis } from '@/types/calculator';
import type { ProcessResults } from '@/utils/processAssessment/calculations';
import type { CACMetrics } from '@/types/assessment';

export interface AssessmentData {
  responses: Record<string, any>;
  currentStep: number;
  totalSteps: number;
  qualificationScore?: number;
  automationPotential?: number;
  sectionScores?: AssessmentScores;
  results?: {
    process?: ProcessResults;
    cac?: CACMetrics;
    annual?: {
      savings: number;
      hours: number;
    };
  };
  industryAnalysis?: IndustryAnalysis;
  userInfo?: {
    name: string;
    email: string;
    phone: string;
  };
  completed?: boolean;
}

export interface AssessmentContextType {
  assessmentData: AssessmentData | null;
  setAssessmentData: (data: AssessmentData) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  updateResults: (processResults: ProcessResults, cacMetrics: CACMetrics) => void;
}

const AssessmentContext = createContext<AssessmentContextType | undefined>(undefined);

export const AssessmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [assessmentData, setAssessmentData] = useState<AssessmentData>({
    responses: {},
    currentStep: 0,
    totalSteps: 7,
    completed: false
  });
  const [currentStep, setCurrentStep] = useState(0);

  console.log('Assessment Context - Current Data:', assessmentData);

  const handleSetAssessmentData = (data: AssessmentData) => {
    console.log('Setting assessment data:', data);
    setAssessmentData(prevData => ({
      ...prevData,
      ...data,
      responses: {
        ...(prevData?.responses || {}),
        ...(data.responses || {})
      }
    }));
  };

  const updateResults = (processResults: ProcessResults, cacMetrics: CACMetrics) => {
    console.log('Updating results with:', { processResults, cacMetrics });
    
    setAssessmentData(prevData => ({
      ...prevData,
      results: {
        process: processResults,
        cac: cacMetrics,
        annual: {
          savings: processResults.savings.annual,
          hours: Math.round(processResults.costs.current / (25 * (prevData.processes?.manualProcesses?.length || 1)))
        }
      }
    }));
  };

  return (
    <AssessmentContext.Provider
      value={{
        assessmentData,
        setAssessmentData: handleSetAssessmentData,
        currentStep,
        setCurrentStep,
        updateResults
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