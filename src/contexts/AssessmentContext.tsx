import React, { createContext, useContext, useState } from 'react';

interface AssessmentData {
  responses: Record<string, any>;
  currentStep: number;
  totalSteps: number;
  score?: number;
  recommendations?: string[];
}

interface AssessmentContextType {
  assessmentState: {
    assessmentData: AssessmentData | null;
    isLoading: boolean;
    error: string | null;
  };
  setAssessmentData: (data: AssessmentData) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  resetAssessment: () => void;
}

const AssessmentContext = createContext<AssessmentContextType | undefined>(undefined);

export const AssessmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [assessmentData, setAssessmentData] = useState<AssessmentData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetAssessment = () => {
    setAssessmentData(null);
    setError(null);
    setIsLoading(false);
  };

  return (
    <AssessmentContext.Provider value={{
      assessmentState: {
        assessmentData,
        isLoading,
        error
      },
      setAssessmentData,
      setLoading: setIsLoading,
      setError,
      resetAssessment
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