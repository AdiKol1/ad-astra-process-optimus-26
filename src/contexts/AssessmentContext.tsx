import React, { createContext, useContext, useState, useCallback } from 'react';
import { RawAssessmentData, ComputedMetrics, AssessmentReport } from '@/types/assessment/core';
import { assessmentService } from '@/services/AssessmentService';

interface AssessmentContextType {
  rawData: RawAssessmentData | null;
  computedMetrics: ComputedMetrics | null;
  report: AssessmentReport | null;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  updateResponses: (responses: Record<string, any>) => void;
  calculateMetrics: () => void;
  generateReport: () => void;
}

const AssessmentContext = createContext<AssessmentContextType | undefined>(undefined);

export const AssessmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [rawData, setRawData] = useState<RawAssessmentData | null>(null);
  const [computedMetrics, setComputedMetrics] = useState<ComputedMetrics | null>(null);
  const [report, setReport] = useState<AssessmentReport | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

  const updateResponses = useCallback((responses: Record<string, any>) => {
    setRawData(prevData => ({
      responses: {
        ...(prevData?.responses || {}),
        ...responses
      },
      metadata: {
        startedAt: prevData?.metadata.startedAt || new Date().toISOString(),
        currentStep,
        totalSteps: 7 // Update this based on your total steps
      }
    }));
  }, [currentStep]);

  const calculateMetrics = useCallback(() => {
    if (!rawData) return;
    
    console.log('Calculating metrics...');
    const metrics = assessmentService.calculateMetrics(rawData);
    setComputedMetrics(metrics);
  }, [rawData]);

  const generateReport = useCallback(() => {
    if (!computedMetrics) return;
    
    console.log('Generating report...');
    const generatedReport = assessmentService.generateReport(computedMetrics);
    setReport(generatedReport);
  }, [computedMetrics]);

  return (
    <AssessmentContext.Provider
      value={{
        rawData,
        computedMetrics,
        report,
        currentStep,
        setCurrentStep,
        updateResponses,
        calculateMetrics,
        generateReport
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