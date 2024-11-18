import React, { createContext, useContext, useState } from 'react';

interface AssessmentData {
  responses: Record<string, any>;
  currentStep: number;
  totalSteps: number;
  score?: number;
  recommendations?: string[];
}

interface AssessmentContextType {
  auditState: {
    assessmentData: AssessmentData | null;
  };
  setAssessmentData: (data: AssessmentData) => void;
}

const AssessmentContext = createContext<AssessmentContextType | undefined>(undefined);

export const AssessmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [assessmentData, setAssessmentData] = useState<AssessmentData | null>(null);

  return (
    <AssessmentContext.Provider value={{
      auditState: { assessmentData },
      setAssessmentData
    }}>
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