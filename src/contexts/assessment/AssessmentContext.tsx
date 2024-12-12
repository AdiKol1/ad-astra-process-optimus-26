import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { AssessmentState, AssessmentResponses } from '@/types/assessment/core';
import { useProcess } from './ProcessContext';
import { useMarketing } from './MarketingContext';

interface AssessmentContextType {
  state: AssessmentState;
  setResponses: (responses: Partial<AssessmentResponses>) => void;
  setCurrentStep: (step: number) => void;
  calculateResults: () => Promise<void>;
  resetAssessment: () => void;
}

const initialState: AssessmentState = {
  currentStep: 0,
  totalSteps: 7,
  responses: {},
  completed: false,
  process: {
    metrics: null,
    results: null
  },
  marketing: {
    metrics: null,
    results: null
  }
};

type AssessmentAction =
  | { type: 'SET_RESPONSES'; payload: Partial<AssessmentResponses> }
  | { type: 'SET_STEP'; payload: number }
  | { type: 'SET_COMPLETED'; payload: boolean }
  | { type: 'RESET' };

const assessmentReducer = (state: AssessmentState, action: AssessmentAction): AssessmentState => {
  switch (action.type) {
    case 'SET_RESPONSES':
      return {
        ...state,
        responses: { ...state.responses, ...action.payload }
      };
    case 'SET_STEP':
      return { ...state, currentStep: action.payload };
    case 'SET_COMPLETED':
      return { ...state, completed: action.payload };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
};

const AssessmentContext = createContext<AssessmentContextType | undefined>(undefined);

export const AssessmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(assessmentReducer, initialState);
  const process = useProcess();
  const marketing = useMarketing();

  const setResponses = useCallback((responses: Partial<AssessmentResponses>) => {
    console.log('Setting assessment data:', responses);
    dispatch({ type: 'SET_RESPONSES', payload: responses });
  }, []);

  const setCurrentStep = useCallback((step: number) => {
    console.log('Setting current step:', step);
    dispatch({ type: 'SET_STEP', payload: step });
  }, []);

  const calculateResults = useCallback(async () => {
    console.log('Calculating assessment results');
    
    // Calculate process metrics
    await process.calculateMetrics(state.responses);
    
    // Calculate marketing metrics
    await marketing.calculateMetrics(state.responses);
    
    dispatch({ type: 'SET_COMPLETED', payload: true });
  }, [state.responses, process, marketing]);

  const resetAssessment = useCallback(() => {
    console.log('Resetting assessment');
    dispatch({ type: 'RESET' });
    process.resetState();
    marketing.resetState();
  }, [process, marketing]);

  return (
    <AssessmentContext.Provider
      value={{
        state,
        setResponses,
        setCurrentStep,
        calculateResults,
        resetAssessment
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
