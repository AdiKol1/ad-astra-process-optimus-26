import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

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
  setAssessmentData: (data: AssessmentData | null) => void;
  updateResponses: (responses: Record<string, any>) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  leadData: LeadData | null;
  setLeadData: (data: LeadData | null) => void;
  isPreviewMode: boolean;
  setPreviewMode: (mode: boolean) => void;
  leadScore: number;
  setLeadScore: (score: number) => void;
  isLoading: boolean;
}

const AssessmentContext = createContext<AssessmentContextType | undefined>(undefined);

interface AssessmentProviderProps {
  children: React.ReactNode;
  initialData?: AssessmentData;
}

export const AssessmentProvider: React.FC<AssessmentProviderProps> = ({ 
  children,
  initialData = {
    responses: {},
    currentStep: 0,
    completed: false
  }
}) => {
  const [assessmentData, setAssessmentData] = useState<AssessmentData | null>(initialData);
  const [currentStep, setCurrentStep] = useState(initialData.currentStep);
  const [leadData, setLeadData] = useState<LeadData | null>(null);
  const [isPreviewMode, setPreviewMode] = useState(false);
  const [leadScore, setLeadScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize assessment data
  useEffect(() => {
    const initializeAssessment = async () => {
      try {
        if (!assessmentData) {
          setAssessmentData(initialData);
        }
      } catch (error) {
        console.error('Error initializing assessment:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAssessment();
  }, []);

  // Keep currentStep in sync with assessmentData
  useEffect(() => {
    if (assessmentData && assessmentData.currentStep !== currentStep) {
      setAssessmentData({
        ...assessmentData,
        currentStep
      });
    }
  }, [currentStep, assessmentData]);

  const updateResponses = useCallback((responses: Record<string, any>) => {
    if (!assessmentData) return;
    
    setAssessmentData({
      ...assessmentData,
      responses: {
        ...assessmentData.responses,
        ...responses
      }
    });
  }, [assessmentData]);

  return (
    <AssessmentContext.Provider
      value={{
        assessmentData,
        setAssessmentData,
        updateResponses,
        currentStep,
        setCurrentStep,
        leadData,
        setLeadData,
        isPreviewMode,
        setPreviewMode,
        leadScore,
        setLeadScore,
        isLoading
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