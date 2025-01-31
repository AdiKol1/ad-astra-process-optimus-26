import * as React from 'react';
import { useAssessmentStore } from '@/stores/assessment';
import type { PropsWithChildren } from 'react';

const AssessmentContext = React.createContext<ReturnType<typeof useAssessmentStore> | null>(null);

export const AssessmentProvider = ({ children }: PropsWithChildren) => {
  const store = useAssessmentStore();
  
  return (
    <AssessmentContext.Provider value={store}>
      {children}
    </AssessmentContext.Provider>
  );
};

export const useAssessment = () => {
  const context = React.useContext(AssessmentContext);
  if (!context) {
    throw new Error('useAssessment must be used within AssessmentProvider');
  }
  return context;
};
