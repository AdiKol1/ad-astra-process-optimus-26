import React from 'react';
import { useAssessmentStore } from '@/stores/assessment';
import { useAssessmentAutoSave } from '@/hooks/assessment/useAssessmentAutoSave';
import { useAssessmentRecovery } from '@/hooks/assessment/useAssessmentRecovery';
import { useAssessmentSync } from '@/hooks/assessment/useAssessmentSync';
import { logger } from '@/utils/logger';
import { telemetry } from '@/utils/monitoring/telemetry';
import { createPerformanceMonitor } from '@/utils/monitoring/performance';
import { ErrorBoundary } from '@/components/error/ErrorBoundary';

interface Props {
  children: React.ReactNode;
}

export const AssessmentProvider: React.FC<Props> = ({ children }) => {
  const store = useAssessmentStore();
  const performanceMonitor = createPerformanceMonitor('AssessmentProvider');
  
  // Initialize hooks
  const { forceSave } = useAssessmentAutoSave();
  const { isRecovering, hasRecoveredState, error: recoveryError } = useAssessmentRecovery();
  const { isSyncing, error: syncError } = useAssessmentSync();

  // Handle initialization errors
  React.useEffect(() => {
    if (recoveryError) {
      logger.error('Assessment recovery failed', {
        component: 'AssessmentProvider',
        error: recoveryError
      });

      telemetry.track('assessment_recovery_error', {
        error: recoveryError.message
      });
    }

    if (syncError) {
      logger.error('Assessment sync failed', {
        component: 'AssessmentProvider',
        error: syncError
      });

      telemetry.track('assessment_sync_error', {
        error: syncError.message
      });
    }
  }, [recoveryError, syncError]);

  // Force save before unload
  React.useEffect(() => {
    const handleBeforeUnload = () => {
      const perfMark = performanceMonitor.start('force_save_before_unload');
      
      try {
        forceSave();
        performanceMonitor.end(perfMark);
      } catch (error) {
        logger.error('Failed to save before unload', {
          component: 'AssessmentProvider',
          error
        });
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [forceSave]);

  // Show loading state while recovering
  if (isRecovering) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Recovering assessment state...</p>
        </div>
      </div>
    );
  }

  // Show error state if recovery failed
  if (recoveryError && !hasRecoveredState) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-destructive mb-4">Failed to recover assessment state</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      {children}
    </ErrorBoundary>
  );
};
