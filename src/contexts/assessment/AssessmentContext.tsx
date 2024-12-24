import React, { createContext, useContext, useReducer, useCallback, useState, useEffect, useMemo } from 'react';
import { AssessmentState, AssessmentResponses, AssessmentData } from '@/types/assessment/core';
import { useProcess } from './ProcessContext';
import { useMarketing } from './MarketingContext';
import { logger } from '@/utils/logger';

interface AssessmentContextType {
  state: AssessmentState;
  assessmentData: AssessmentData;
  setAssessmentData: (data: AssessmentData) => void;
  setResponses: (responses: Partial<AssessmentResponses>) => void;
  setCurrentStep: (step: number) => void;
  calculateResults: () => Promise<void>;
  resetAssessment: () => void;
  currentStep: number;
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
  const [assessmentData, setAssessmentDataInternal] = useState<AssessmentData>({});
  const { calculateMetrics: calculateProcessMetrics } = useProcess();
  const { calculateMetrics: calculateMarketingMetrics } = useMarketing();

  const setAssessmentData = useCallback((data: AssessmentData) => {
    logger.info('Setting assessment data:', data);
    setAssessmentDataInternal(data);
  }, []);

  const setResponses = useCallback((responses: Partial<AssessmentResponses>) => {
    logger.info('Setting responses:', responses);
    dispatch({ type: 'SET_RESPONSES', payload: responses });
  }, []);

  const setCurrentStep = useCallback((step: number) => {
    logger.info('Setting current step:', step);
    dispatch({ type: 'SET_STEP', payload: step });
  }, []);

  const calculateResults = useCallback(async () => {
    try {
      if (!state.responses) return;
      
      const [processMetrics, marketingMetrics] = await Promise.all([
        calculateProcessMetrics(state.responses),
        calculateMarketingMetrics(state.responses)
      ]);
      
      // Combine metrics and calculate overall scores
      const qualificationScore = Math.round((processMetrics.score + marketingMetrics.score) / 2);
      const automationPotential = Math.round((processMetrics.automationPotential + marketingMetrics.automationPotential) / 2);
      
      const newAssessmentData: AssessmentData = {
        qualificationScore,
        automationPotential,
        results: {
          annual: {
            savings: processMetrics.annualSavings + marketingMetrics.annualSavings,
            hours: processMetrics.annualHours + marketingMetrics.annualHours
          },
          cac: marketingMetrics.cac
        },
        sectionScores: {
          process: processMetrics.score,
          marketing: marketingMetrics.score
        },
        recommendations: {
          process: processMetrics.recommendations,
          marketing: marketingMetrics.recommendations
        },
        industryAnalysis: {
          process: processMetrics.industryAnalysis,
          marketing: marketingMetrics.industryAnalysis
        },
        userInfo: state.responses.userInfo
      };

      setAssessmentData(newAssessmentData);
      dispatch({ type: 'SET_COMPLETED', payload: true });
    } catch (error) {
      logger.error('Error calculating results:', error);
      throw error;
    }
  }, [state.responses, calculateProcessMetrics, calculateMarketingMetrics, setAssessmentData]);

  const resetAssessment = useCallback(() => {
    logger.info('Resetting assessment');
    dispatch({ type: 'RESET' });
    setAssessmentDataInternal({});
  }, []);

  const contextValue = useMemo(() => ({
    state,
    assessmentData,
    setAssessmentData,
    setResponses,
    setCurrentStep,
    calculateResults,
    resetAssessment,
    currentStep: state.currentStep,
  }), [
    state,
    assessmentData,
    setAssessmentData,
    setResponses,
    setCurrentStep,
    calculateResults,
    resetAssessment
  ]);

  return (
    <AssessmentContext.Provider value={contextValue}>
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
