import React, { createContext, useContext, useState } from 'react';
import type { AssessmentData, LeadData } from '@/types/assessment';

export interface SectionScore {
  score: number;
  confidence: number;
  areas: {
    name: string;
    score: number;
    insights: string[];
  }[];
}

export interface Recommendation {
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  timeframe: 'short' | 'medium' | 'long';
  roi: string;
  benefits: string[];
  implementation: {
    steps: string[];
    resources: string[];
    timeline: number; // in weeks
    estimatedCost: number;
  };
}

export interface IndustryBenchmark {
  metric: string;
  value: number;
  industry: number;
  percentile: number;
  trend: 'up' | 'down' | 'stable';
}

export interface PotentialSavings {
  annual: {
    hours: number;
    cost: number;
  };
  fiveYear: {
    hours: number;
    cost: number;
  };
  roi: number;
  paybackPeriod: number; // in months
  hoursSaved: {
    perEmployee: number;
    total: number;
  };
  costReduction: {
    labor: number;
    operational: number;
    technology: number;
  };
  productivity: {
    current: number;
    potential: number;
    improvement: number;
  };
}

export interface AssessmentData {
  responses: Record<string, any>;
  currentStep: number;
  totalSteps: number;
  score?: number;
  recommendations?: Recommendation[];
  sectionScores?: {
    team: SectionScore;
    process: SectionScore;
    technology: SectionScore;
    challenges: SectionScore;
    goals: SectionScore;
    budget: SectionScore;
  };
  industryBenchmarks?: IndustryBenchmark[];
  potentialSavings?: PotentialSavings;
  metadata?: {
    completedAt: string;
    duration: number;
    confidence: number;
  };
}

export interface LeadData {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  role: string;
  phoneNumber?: string;
  industry?: string;
  companySize?: string;
  captureStep?: number;
  partialResponses?: any;
}

export interface AssessmentContextType {
  assessmentData: AssessmentData;
  setAssessmentData: (data: AssessmentData) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  leadData: LeadData | null;
  setLeadData: (data: LeadData | null) => void;
  leadScore: number;
  setLeadScore: (score: number) => void;
  isPreviewMode: boolean;
  setPreviewMode: (preview: boolean) => void;
}

const initialAssessmentData: AssessmentData = {
  responses: {},
  currentStep: 0,
  totalSteps: 0,
};

export const AssessmentContext = createContext<AssessmentContextType>({
  assessmentData: initialAssessmentData,
  setAssessmentData: () => {},
  currentStep: 0,
  setCurrentStep: () => {},
  leadData: null,
  setLeadData: () => {},
  leadScore: 0,
  setLeadScore: () => {},
  isPreviewMode: true,
  setPreviewMode: () => {},
});

export const AssessmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [assessmentData, setAssessmentData] = useState<AssessmentData>(initialAssessmentData);
  const [currentStep, setCurrentStep] = useState(0);
  const [leadData, setLeadData] = useState<LeadData | null>(null);
  const [leadScore, setLeadScore] = useState(0);
  const [isPreviewMode, setPreviewMode] = useState(true);

  return (
    <AssessmentContext.Provider
      value={{
        assessmentData,
        setAssessmentData,
        currentStep,
        setCurrentStep,
        leadData,
        setLeadData,
        leadScore,
        setLeadScore,
        isPreviewMode,
        setPreviewMode,
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
