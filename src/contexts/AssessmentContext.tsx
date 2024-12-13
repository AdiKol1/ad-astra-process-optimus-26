import React, { createContext, useContext, useState, useCallback } from 'react';
import type { AssessmentData } from '@/types/assessmentTypes';

export interface AssessmentContextType {
  assessmentData: AssessmentData | null;
  setAssessmentData: (data: AssessmentData) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
}

const AssessmentContext = createContext<AssessmentContextType | undefined>(undefined);

const initialAssessmentData: AssessmentData = {
  responses: {},
  currentStep: 0,
  totalSteps: 0,
  qualificationScore: 0,
  automationPotential: 0,
  sectionScores: {},
  results: {
    annual: {
      savings: 0,
      hours: 0
    }
  }
};

export const AssessmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [assessmentData, setAssessmentDataState] = useState<AssessmentData | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

  const setAssessmentData = useCallback((data: AssessmentData) => {
    console.log('Setting assessment data:', data);
    
    // Ensure we're not losing existing data when updating
    setAssessmentDataState(prevData => {
      if (!prevData) {
        return {
          ...initialAssessmentData,
          ...data
        };
      }

      // Merge the new data with existing data, preserving nested objects
      return {
        ...prevData,
        ...data,
        responses: {
          ...prevData.responses,
          ...data.responses
        },
        results: {
          ...prevData.results,
          ...data.results,
          annual: {
            ...prevData.results?.annual,
            ...data.results?.annual
          }
        },
        sectionScores: {
          ...prevData.sectionScores,
          ...data.sectionScores
        }
      };
    });
  }, []);

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