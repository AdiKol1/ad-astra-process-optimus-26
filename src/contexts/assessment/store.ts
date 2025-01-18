import { AssessmentState, StepPerformanceMetrics } from '@/types/assessment/state';
import { AssessmentStep } from '@/types/assessment/steps';
import { AssessmentResponses, Industry, EmployeeRange, TimeSpentRange, ProcessVolumeRange, ErrorRateRange, ProcessComplexity } from '@/types/assessment/core';
import { logger } from '@/utils/logger';
import { encryptData, decryptData } from '@/utils/security/encryption';
import { sanitizeInput } from '@/utils/security/sanitization';
import { telemetry } from '@/utils/monitoring/telemetry';
import { createPerformanceMonitor } from '@/utils/monitoring/performance';
import { migrateAssessmentState } from '@/utils/assessment/migrations';

const STORAGE_KEY = 'assessment_state';
const VERSION = '2.0.0';  // Updated version for new state structure
const MAX_STORAGE_SIZE = 1024 * 1024; // 1MB
const MAX_BACKUPS = 5;
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;
const PERFORMANCE_THRESHOLD_MS = 100; // Log slow operations over 100ms

// Performance monitoring
const performanceMonitor = createPerformanceMonitor('AssessmentStore');

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const generateUUID = () => {
  try {
    return crypto.randomUUID();
  } catch {
    // Fallback if crypto.randomUUID is not available
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = crypto.getRandomValues(new Uint8Array(1))[0] & 15;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
};

// Step performance tracking
const stepPerformanceMap = new Map<AssessmentStep, StepPerformanceMetrics>();

const trackStepPerformance = (step: AssessmentStep, metrics: Partial<StepPerformanceMetrics>) => {
  const current = stepPerformanceMap.get(step) || {
    stepId: step,
    loadTime: 0,
    errorCount: 0
  };

  stepPerformanceMap.set(step, {
    ...current,
    ...metrics,
    errorCount: metrics.errorCount !== undefined ? 
      current.errorCount + metrics.errorCount : 
      current.errorCount
  });

  // Report if metrics exceed thresholds
  if (metrics.loadTime && metrics.loadTime > PERFORMANCE_THRESHOLD_MS) {
    telemetry.track('assessment_step_slow_load', {
      step,
      loadTime: metrics.loadTime
    });
  }
};

const validateResponses = (responses: any): responses is AssessmentResponses => {
  if (!responses || typeof responses !== 'object') return false;

  // Type guards with strict validation
  const isIndustry = (value: any): value is Industry =>
    typeof value === 'string' &&
    ['Technology', 'Healthcare', 'Financial Services', 'Real Estate', 'Other'].includes(value);

  const isEmployeeRange = (value: any): value is EmployeeRange =>
    typeof value === 'string' &&
    ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'].includes(value);

  const isTimeSpentRange = (value: any): value is TimeSpentRange =>
    typeof value === 'string' &&
    ['0-10', '11-20', '20-40', '40+'].includes(value);

  const isProcessVolumeRange = (value: any): value is ProcessVolumeRange =>
    typeof value === 'string' &&
    ['0-50', '51-100', '100-500', '500+'].includes(value);

  const isErrorRateRange = (value: any): value is ErrorRateRange =>
    typeof value === 'string' &&
    ['0-1%', '1-3%', '3-5%', '5%+'].includes(value);

  const isProcessComplexity = (value: any): value is ProcessComplexity =>
    typeof value === 'string' &&
    [
      'Simple - Linear flow with few decision points',
      'Medium - Some complexity with decision points',
      'Complex - Many decision points and variations',
      'Very Complex - Multiple integrations and custom logic'
    ].includes(value);

  // Validate and sanitize each field
  const sanitizedResponses = {
    industry: responses.industry ? sanitizeInput(responses.industry) : '',
    employees: responses.employees ? sanitizeInput(responses.employees) : '',
    timeSpent: responses.timeSpent ? sanitizeInput(responses.timeSpent) : '',
    processVolume: responses.processVolume ? sanitizeInput(responses.processVolume) : '',
    errorRate: responses.errorRate ? sanitizeInput(responses.errorRate) : '',
    processComplexity: responses.processComplexity ? sanitizeInput(responses.processComplexity) : ''
  };

  // Check each field with strict validation
  return (
    (!sanitizedResponses.industry || isIndustry(sanitizedResponses.industry)) &&
    (!sanitizedResponses.employees || isEmployeeRange(sanitizedResponses.employees)) &&
    (!sanitizedResponses.timeSpent || isTimeSpentRange(sanitizedResponses.timeSpent)) &&
    (!sanitizedResponses.processVolume || isProcessVolumeRange(sanitizedResponses.processVolume)) &&
    (!sanitizedResponses.errorRate || isErrorRateRange(sanitizedResponses.errorRate)) &&
    (!sanitizedResponses.processComplexity || isProcessComplexity(sanitizedResponses.processComplexity))
  );
};

const cleanupBackups = async () => {
  const mark = performanceMonitor.start('cleanup_backups');

  try {
    const backups = Object.keys(localStorage)
      .filter(key => key.startsWith(`${STORAGE_KEY}_backup_`))
      .sort()
      .reverse();

    // Keep only the latest MAX_BACKUPS backups
    const toRemove = backups.slice(MAX_BACKUPS);
    
    for (const key of toRemove) {
      try {
        await decryptData(localStorage.getItem(key) || '');
        localStorage.removeItem(key);
        logger.info('Removed old backup:', key);
      } catch (err) {
        logger.warn('Failed to remove backup:', { key, error: err });
        telemetry.track('backup_removal_failed', {
          key,
          error: err instanceof Error ? err.message : 'Unknown error'
        });
      }
    }

    telemetry.track('backups_cleaned', {
      removed: toRemove.length,
      remaining: Math.min(backups.length, MAX_BACKUPS)
    });
  } catch (err) {
    logger.error('Failed to cleanup backups:', err);
    telemetry.track('backup_cleanup_failed', {
      error: err instanceof Error ? err.message : 'Unknown error'
    });
  } finally {
    performanceMonitor.end(mark);
  }
};

export const createAssessmentStore = () => {
  const createFreshState = (): AssessmentState => ({
    currentStep: 'initial',
    responses: {},
    metadata: {
      startTime: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      attempts: 0,
      analyticsId: generateUUID(),
      version: VERSION
    },
    isComplete: false,
    isLoading: false,
    stepHistory: ['initial'],
    lastValidStep: 'initial'
  });

  const getInitialState = async (): Promise<AssessmentState> => {
    const mark = performanceMonitor.start('get_initial_state');

    try {
      const encrypted = localStorage.getItem(STORAGE_KEY);
      if (!encrypted) {
        return createFreshState();
      }

      // Check storage size
      if (encrypted.length > MAX_STORAGE_SIZE) {
        logger.error('Stored state exceeds maximum size');
        telemetry.track('state_size_exceeded', {
          size: encrypted.length,
          maxSize: MAX_STORAGE_SIZE
        });
        return createFreshState();
      }

      // Decrypt and parse state
      const decrypted = await decryptData(encrypted);
      const parsed = JSON.parse(decrypted);

      // Validate version and migrate if necessary
      if (parsed.metadata?.version !== VERSION) {
        logger.info('Migrating state from version', {
          from: parsed.metadata?.version,
          to: VERSION
        });
        return await migrateAssessmentState(parsed);
      }

      // Validate responses
      if (!validateResponses(parsed.responses)) {
        logger.error('Invalid responses in stored state');
        telemetry.track('invalid_stored_responses');
        return createFreshState();
      }

      return parsed as AssessmentState;
    } catch (err) {
      logger.error('Failed to load initial state:', err);
      telemetry.track('initial_state_load_failed', {
        error: err instanceof Error ? err.message : 'Unknown error'
      });
      return createFreshState();
    } finally {
      performanceMonitor.end(mark);
    }
  };

  const saveState = async (state: AssessmentState): Promise<void> => {
    const mark = performanceMonitor.start('save_state');
    let retries = 0;

    while (retries < MAX_RETRIES) {
      try {
        // Create backup first
        const currentState = localStorage.getItem(STORAGE_KEY);
        if (currentState) {
          const backupKey = `${STORAGE_KEY}_backup_${Date.now()}`;
          localStorage.setItem(backupKey, currentState);
        }

        // Encrypt and save new state
        const encrypted = await encryptData(JSON.stringify(state));
        localStorage.setItem(STORAGE_KEY, encrypted);

        // Cleanup old backups
        await cleanupBackups();

        // Track performance metrics
        trackStepPerformance(state.currentStep, {
          loadTime: performanceMonitor.getDuration(mark)
        });

        return;
      } catch (err) {
        retries++;
        logger.warn('Failed to save state, retrying:', {
          attempt: retries,
          error: err
        });
        await sleep(RETRY_DELAY * retries);
      }
    }

    // If we get here, all retries failed
    const error = new Error('Failed to save state after max retries');
    logger.error(error);
    telemetry.track('state_save_failed', {
      attempts: retries,
      currentStep: state.currentStep
    });
    throw error;
  };

  const getStepMetrics = (step: AssessmentStep): StepPerformanceMetrics => {
    return stepPerformanceMap.get(step) || {
      stepId: step,
      loadTime: 0,
      errorCount: 0
    };
  };

  return {
    getInitialState,
    saveState,
    getStepMetrics
  };
};
