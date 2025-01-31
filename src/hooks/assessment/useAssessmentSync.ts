import { useEffect, useRef, useState } from 'react';
import { useAssessmentStore } from '@/stores/assessment';
import { logger } from '@/utils/logger';
import { telemetry } from '@/utils/monitoring/telemetry';
import { createPerformanceMonitor } from '@/utils/monitoring/performance';
import type { AssessmentResponses, AssessmentStep, AssessmentResults } from '@/types/assessment/state';

interface PendingUpdate {
  id: string;
  timestamp: string;
  type: 'response' | 'step' | 'complete';
  data: any;
}

interface SyncState {
  isSyncing: boolean;
  lastSyncTime: Date | null;
  pendingUpdates: PendingUpdate[];
  error: Error | null;
}

export const useAssessmentSync = () => {
  const store = useAssessmentStore();
  const performanceMonitor = createPerformanceMonitor('AssessmentSync');
  const pendingUpdatesRef = useRef<PendingUpdate[]>([]);
  const [syncState, setSyncState] = useState<SyncState>({
    isSyncing: false,
    lastSyncTime: null,
    pendingUpdates: [],
    error: null
  });

  // Function to apply an update optimistically
  const applyOptimisticUpdate = (update: PendingUpdate) => {
    const perfMark = performanceMonitor.start('optimistic_update');
    
    try {
      switch (update.type) {
        case 'response':
          store.updateResponses(update.data as Partial<AssessmentResponses>);
          break;
        case 'step':
          store.setStep(update.data as AssessmentStep);
          break;
        case 'complete':
          store.setResults(update.data as AssessmentResults);
          break;
      }

      pendingUpdatesRef.current.push(update);
      setSyncState(prev => ({
        ...prev,
        pendingUpdates: [...prev.pendingUpdates, update]
      }));

      telemetry.track('optimistic_update_applied', {
        updateType: update.type,
        duration: performanceMonitor.end(perfMark)
      });
    } catch (error) {
      logger.error('Failed to apply optimistic update', {
        component: 'AssessmentSync',
        update,
        error
      });

      telemetry.track('optimistic_update_failed', {
        error: error instanceof Error ? error.message : 'Unknown error',
        updateType: update.type
      });

      throw error;
    }
  };

  // Function to resolve conflicts
  const resolveConflicts = async (serverState: any, clientUpdates: PendingUpdate[]) => {
    const perfMark = performanceMonitor.start('conflict_resolution');

    try {
      // Sort updates by timestamp
      const sortedUpdates = [...clientUpdates].sort(
        (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );

      // Apply each update sequentially
      for (const update of sortedUpdates) {
        // Check if update is still valid given server state
        const isValid = validateUpdate(update, serverState);
        
        if (isValid) {
          // Re-apply the update
          switch (update.type) {
            case 'response':
              store.updateResponses(update.data);
              break;
            case 'step':
              store.setStep(update.data);
              break;
            case 'complete':
              store.setResults(update.data);
              break;
          }
        } else {
          logger.warn('Discarding invalid update during conflict resolution', {
            component: 'AssessmentSync',
            update
          });

          telemetry.track('update_discarded', {
            updateType: update.type,
            reason: 'conflict'
          });
        }
      }

      telemetry.track('conflicts_resolved', {
        updatesProcessed: sortedUpdates.length,
        duration: performanceMonitor.end(perfMark)
      });
    } catch (error) {
      logger.error('Failed to resolve conflicts', {
        component: 'AssessmentSync',
        error
      });

      telemetry.track('conflict_resolution_failed', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });

      throw error;
    }
  };

  // Function to validate an update against current state
  const validateUpdate = (update: PendingUpdate, currentState: any): boolean => {
    switch (update.type) {
      case 'response':
        // Validate response update
        return validateResponseUpdate(update.data, currentState);
      case 'step':
        // Validate step transition
        return validateStepTransition(update.data, currentState);
      case 'complete':
        // Validate completion
        return validateCompletion(update.data, currentState);
      default:
        return false;
    }
  };

  // Validation helper functions
  const validateResponseUpdate = (
    responses: Partial<AssessmentResponses>,
    currentState: any
  ): boolean => {
    // Add your response validation logic here
    return true;
  };

  const validateStepTransition = (
    step: AssessmentStep,
    currentState: any
  ): boolean => {
    // Add your step transition validation logic here
    return true;
  };

  const validateCompletion = (
    completionData: any,
    currentState: any
  ): boolean => {
    // Add your completion validation logic here
    return true;
  };

  // Function to sync with server
  const syncWithServer = async () => {
    const perfMark = performanceMonitor.start('sync');

    setSyncState(prev => ({
      ...prev,
      isSyncing: true,
      error: null
    }));

    try {
      // Here you would typically:
      // 1. Get server state
      // 2. Resolve any conflicts
      // 3. Apply pending updates
      // 4. Clear pending updates

      setSyncState(prev => ({
        ...prev,
        isSyncing: false,
        lastSyncTime: new Date(),
        pendingUpdates: [],
        error: null
      }));

      pendingUpdatesRef.current = [];

      telemetry.track('sync_completed', {
        duration: performanceMonitor.end(perfMark)
      });
    } catch (error) {
      logger.error('Failed to sync with server', {
        component: 'AssessmentSync',
        error
      });

      telemetry.track('sync_failed', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });

      setSyncState(prev => ({
        ...prev,
        isSyncing: false,
        error: error instanceof Error ? error : new Error('Sync failed')
      }));
    }
  };

  // Set up periodic sync
  useEffect(() => {
    const syncInterval = setInterval(syncWithServer, 60000); // Sync every minute

    return () => {
      clearInterval(syncInterval);
    };
  }, []);

  return {
    ...syncState,
    applyUpdate: applyOptimisticUpdate,
    sync: syncWithServer
  };
}; 