import React, { createContext, useContext, useEffect } from 'react';
import { useStore } from 'zustand';
import { createAssessmentStore } from './store';
import { AssessmentState } from '@/types/assessment/state';
import { logger } from '@/utils/logger';
import { telemetry } from '@/utils/monitoring/telemetry';
import { createPerformanceMonitor } from '@/utils/monitoring/performance';

const AssessmentContext = createContext<ReturnType<typeof createAssessmentStore> | null>(null);

export const useAssessment = () => {
  const context = useContext(AssessmentContext);
  if (!context) {
    throw new Error('useAssessment must be used within an AssessmentProvider');
  }
  return context;
};

interface AssessmentProviderProps {
  children: React.ReactNode;
}

export const AssessmentProvider: React.FC<AssessmentProviderProps> = ({ children }) => {
  const store = React.useMemo(() => createAssessmentStore(), []);
  const performanceMonitor = createPerformanceMonitor('AssessmentProvider');

  useEffect(() => {
    performanceMonitor.start('initialization');
    
    // Initialize telemetry
    telemetry.track('assessment_provider_mounted');

    // Log provider initialization
    logger.info('AssessmentProvider initialized');

    return () => {
      performanceMonitor.end('initialization');
      telemetry.track('assessment_provider_unmounted');
    };
  }, []);

  return (
    <AssessmentContext.Provider value={store}>
      {children}
    </AssessmentContext.Provider>
  );
};

export default AssessmentProvider;
