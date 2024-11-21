import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

interface AssessmentData {
  responses: Record<string, any>;
  currentStep: number;
  completed: boolean;
  scores?: {
    process: number;
    marketing: number;
    overall: number;
  };
}

interface LeadData {
  email: string;
  name?: string;
  company?: string;
  role?: string;
  painPoint?: string;
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
  calculateScores: () => void;
  isLoading: boolean;
}

const AssessmentContext = createContext<AssessmentContextType | undefined>(undefined);

interface AssessmentProviderProps {
  children: React.ReactNode;
  initialData?: AssessmentData;
}

const calculateMarketingScore = (responses: Record<string, any>): number => {
  let score = 0;
  const maxScore = 100;

  // Marketing challenges score (max 50 points)
  const challenges = responses.marketingChallenges || [];
  const challengeScore = (challenges.length / 7) * 50; // 7 is the total number of possible challenges

  // Tool stack score (max 50 points)
  const tools = responses.toolStack || [];
  const hasBasicTools = tools.includes('Spreadsheets/Manual tracking') || 
                       tools.includes('Email marketing platform');
  const hasAdvancedTools = tools.includes('Marketing automation platform') || 
                          tools.includes('CRM system');
  const toolScore = hasAdvancedTools ? 50 : (hasBasicTools ? 25 : 0);

  score = challengeScore + toolScore;
  return Math.min(score, maxScore);
};

const calculateProcessScore = (responses: Record<string, any>): number => {
  let score = 0;
  const maxScore = 100;

  // Team size impact (max 25 points)
  const teamSize = responses.teamSize || [];
  const hasLargeTeam = teamSize.some(size => 
    size === "More than 50 people" || size === "21-50 people"
  );
  const teamScore = hasLargeTeam ? 25 : 15;

  // Manual processes impact (max 25 points)
  const manualProcesses = responses.manualProcesses || [];
  const processScore = (manualProcesses.length / 7) * 25;

  // Volume impact (max 25 points)
  const volumes = responses.processVolume || [];
  const hasHighVolume = volumes.some(vol => 
    vol.includes("More than 50,000") || vol.includes("10,000-50,000")
  );
  const volumeScore = hasHighVolume ? 25 : 15;

  // Error rate impact (max 25 points)
  const errorRates = responses.errorRate || [];
  const hasHighErrors = errorRates.some(rate => 
    rate.includes("More than 10%") || rate.includes("5-10%")
  );
  const errorScore = hasHighErrors ? 25 : 15;

  score = teamScore + processScore + volumeScore + errorScore;
  return Math.min(score, maxScore);
};

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
  const [isLoading, setIsLoading] = useState(true);

  const calculateScores = useCallback(() => {
    if (!assessmentData?.responses) return;

    const processScore = calculateProcessScore(assessmentData.responses);
    const marketingScore = calculateMarketingScore(assessmentData.responses);
    const overallScore = (processScore + marketingScore) / 2;

    setAssessmentData(prev => ({
      ...prev!,
      scores: {
        process: processScore,
        marketing: marketingScore,
        overall: overallScore
      }
    }));
  }, [assessmentData?.responses]);

  const updateResponses = useCallback((newResponses: Record<string, any>) => {
    setAssessmentData(prev => ({
      ...prev!,
      responses: {
        ...prev!.responses,
        ...newResponses
      }
    }));
  }, []);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const value = {
    assessmentData,
    setAssessmentData,
    updateResponses,
    currentStep,
    setCurrentStep,
    leadData,
    setLeadData,
    isPreviewMode,
    setPreviewMode,
    calculateScores,
    isLoading
  };

  return (
    <AssessmentContext.Provider value={value}>
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