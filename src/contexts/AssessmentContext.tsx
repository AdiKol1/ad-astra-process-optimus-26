import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AssessmentData {
  responses: Record<string, any>;
  currentStep: number;
  completed: boolean;
}

interface LeadData {
  email: string;
  name?: string;
  company?: string;
  role?: string;
}

interface AssessmentContextType {
  assessmentData: AssessmentData | null;
  setAssessmentData: (data: AssessmentData) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  leadData: LeadData | null;
  setLeadData: (data: LeadData | null) => void;
  isPreviewMode: boolean;
  setPreviewMode: (mode: boolean) => void;
  leadScore: number;
  setLeadScore: (score: number) => void;
}

const AssessmentContext = createContext<AssessmentContextType | undefined>(undefined);

export const AssessmentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [assessmentData, setAssessmentData] = useState<AssessmentData | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [leadData, setLeadData] = useState<LeadData | null>(null);
  const [isPreviewMode, setPreviewMode] = useState(false);
  const [leadScore, setLeadScore] = useState(0);

  return (
    <AssessmentContext.Provider
      value={{
        assessmentData,
        setAssessmentData,
        currentStep,
        setCurrentStep,
        leadData,
        setLeadData,
        isPreviewMode,
        setPreviewMode,
        leadScore,
        setLeadScore,
      }}
    >
      {children}
    </AssessmentContext.Provider>
  );
};

export const useAssessment = () => {
  const context = useContext(AssessmentContext);
  if (context === undefined) {
    throw new Error('useAssessment must be used within an AssessmentProvider');
  }
  return context;
};

export default AssessmentContext;