import React, { createContext, useContext, useState } from 'react';

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

const AssessmentContext = createContext<AssessmentContextType>({
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

  const validateAndSetAssessmentData = (data: AssessmentData) => {
    // Validate required fields
    if (typeof data.currentStep !== 'number' || typeof data.totalSteps !== 'number') {
      console.error('Invalid assessment data: missing required fields');
      return;
    }

    // Validate and normalize score
    if (data.score !== undefined) {
      data.score = Math.max(0, Math.min(1, data.score));
    }

    // Validate and normalize section scores
    if (data.sectionScores) {
      Object.values(data.sectionScores).forEach(section => {
        if (section) {
          section.score = Math.max(0, Math.min(1, section.score));
          section.confidence = Math.max(0, Math.min(1, section.confidence));
        }
      });
    }

    // Validate potential savings
    if (data.potentialSavings) {
      const ps = data.potentialSavings;
      ps.annual.hours = Math.max(0, ps.annual.hours);
      ps.annual.cost = Math.max(0, ps.annual.cost);
      ps.fiveYear.hours = Math.max(0, ps.fiveYear.hours);
      ps.fiveYear.cost = Math.max(0, ps.fiveYear.cost);
      ps.roi = Math.max(0, ps.roi);
      ps.paybackPeriod = Math.max(0, ps.paybackPeriod);
      ps.hoursSaved.perEmployee = Math.max(0, ps.hoursSaved.perEmployee);
      ps.hoursSaved.total = Math.max(0, ps.hoursSaved.total);
    }

    // Add metadata
    data.metadata = {
      completedAt: new Date().toISOString(),
      duration: calculateAssessmentDuration(data),
      confidence: calculateOverallConfidence(data)
    };

    setAssessmentData(data);
  };

  const calculateAssessmentDuration = (data: AssessmentData): number => {
    // Calculate time spent on assessment in minutes
    return 15; // Placeholder - implement actual calculation
  };

  const calculateOverallConfidence = (data: AssessmentData): number => {
    if (!data.sectionScores) return 0.7; // Default confidence

    const sections = Object.values(data.sectionScores);
    return sections.reduce((sum, section) => sum + section.confidence, 0) / sections.length;
  };

  return (
    <AssessmentContext.Provider
      value={{
        assessmentData,
        setAssessmentData: validateAndSetAssessmentData,
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
  if (context === undefined) {
    throw new Error('useAssessment must be used within an AssessmentProvider');
  }
  return context;
};