import React from 'react';
import { useAssessmentStore } from '@/stores/assessment';
import { logger } from '@/utils/logger';
import { telemetry } from '@/utils/monitoring/telemetry';

interface AssessmentProviderProps {
  children: React.ReactNode;
}

export function AssessmentProvider({ children }: AssessmentProviderProps) {
  const [isInitialized, setIsInitialized] = React.useState(false);
  const store = useAssessmentStore();

  React.useEffect(() => {
    const initializeStore = async () => {
      try {
        // Wait for store to rehydrate
        await new Promise(resolve => setTimeout(resolve, 100));
        
        if (!store.id) {
          logger.info('Initializing new assessment');
          store.reset();
        }

        setIsInitialized(true);
        
        telemetry.track('assessment_provider_initialized', {
          id: store.id,
          isComplete: store.isComplete,
          currentStep: store.currentStep
        });
      } catch (error) {
        logger.error('Failed to initialize assessment provider:', {
          error: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined
        });
        
        // Reset to clean state on error
        store.reset();
        setIsInitialized(true);
      }
    };

    initializeStore();
  }, [store]);

  if (!isInitialized) {
    return null; // Or a loading spinner
  }

  return <>{children}</>;
} 