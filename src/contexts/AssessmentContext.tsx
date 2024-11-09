import React, { createContext, useContext, useState } from 'react';
import type { AssessmentData, AssessmentResults, UserInfo, AuditState } from '@/types/assessment';

interface AssessmentContextType {
  auditState: AuditState;
  setAssessmentData: (data: AssessmentData, userInfo?: UserInfo) => void;
  setResults: (results: AssessmentResults) => void;
  resetAssessment: () => void;
}

const AssessmentContext = createContext<AssessmentContextType | undefined>(undefined);

export function AssessmentProvider({ children }: { children: React.ReactNode }) {
  const [auditState, setAuditState] = useState<AuditState>({
    assessmentData: null,
    results: null,
    userInfo: null,
  });

  const setAssessmentData = (data: AssessmentData, userInfo?: UserInfo) => {
    setAuditState(prev => ({
      ...prev,
      assessmentData: data,
      userInfo: userInfo || prev.userInfo,
    }));
  };

  const setResults = (results: AssessmentResults) => {
    setAuditState(prev => ({
      ...prev,
      results,
    }));
  };

  const resetAssessment = () => {
    setAuditState({
      assessmentData: null,
      results: null,
      userInfo: null,
    });
  };

  return (
    <AssessmentContext.Provider 
      value={{ 
        auditState, 
        setAssessmentData, 
        setResults, 
        resetAssessment 
      }}
    >
      {children}
    </AssessmentContext.Provider>
  );
}

export function useAssessment() {
  const context = useContext(AssessmentContext);
  if (context === undefined) {
    throw new Error('useAssessment must be used within an AssessmentProvider');
  }
  return context;
}