import React from 'react';
import { useAssessmentStore } from './store';
import type { AssessmentStore } from './store';
import { logger } from '@/utils/logger';
import { telemetry } from '@/utils/monitoring/telemetry';
import { createPerformanceMonitor } from '@/utils/monitoring/performance';

interface AssessmentProviderProps {
  children: React.ReactNode;
}

export const AssessmentContext = React.createContext<AssessmentStore | null>(null);

export const useAssessment = () => {
  const context = React.useContext(AssessmentContext);
  if (!context) {
    throw new Error('useAssessment must be used within AssessmentProvider');
  }
  return context;
};

export const AssessmentProvider: React.FC<AssessmentProviderProps> = ({ children }) => {
  const store = useAssessmentStore();
  const performanceMonitor = createPerformanceMonitor('AssessmentProvider');

  React.useEffect(() => {
    console.log('AssessmentProvider: Starting initialization');
    performanceMonitor.start('initialization');
    
    // Initialize telemetry
    telemetry.track('assessment_provider_mounted');

    // Initialize store
    console.log('AssessmentProvider: Setting initialized state');
    store.setInitialized(true);

    // Log assessment start
    logger.assessmentStarted({
      sessionId: store.id || 'unknown',
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    });

    // Log provider initialization
    logger.info('AssessmentProvider initialized');
    console.log('AssessmentProvider: Initialization complete');

    return () => {
      console.log('AssessmentProvider: Cleanup starting');
      performanceMonitor.end('initialization');
      store.setInitialized(false);
      telemetry.track('assessment_provider_unmounted');
      console.log('AssessmentProvider: Cleanup complete');
    };
  }, []); // Empty dependency array to run only on mount/unmount

  return (
    <AssessmentContext.Provider value={store}>
      {children}
    </AssessmentContext.Provider>
  );
};

export default AssessmentProvider;
