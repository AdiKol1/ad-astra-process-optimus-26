import { AssessmentState, AssessmentResponses } from '@/types/assessment';
import { logger } from '../logger';

interface LegacyAssessmentData {
  currentStep?: number;
  totalSteps?: number;
  responses?: Record<string, any>;
  processDetails?: {
    employees?: string;
    industry?: string;
    processVolume?: string;
  };
  processes?: {
    timeSpent?: string;
    errorRate?: string;
  };
  marketing?: {
    budget?: string;
    channels?: string[];
    metrics?: string[];
  };
  completed?: boolean;
}

/**
 * Validates the migrated state to ensure all required fields are present
 */
const validateMigratedState = (state: AssessmentState): boolean => {
  if (typeof state.currentStep !== 'number') {
    logger.error('Invalid state: currentStep must be a number');
    return false;
  }
  
  if (typeof state.totalSteps !== 'number') {
    logger.error('Invalid state: totalSteps must be a number');
    return false;
  }

  if (!state.responses || typeof state.responses !== 'object') {
    logger.error('Invalid state: responses must be an object');
    return false;
  }

  return true;
};

/**
 * Migrates legacy assessment data to the new state structure
 * @param oldData - The legacy assessment data structure
 * @returns The new AssessmentState structure
 */
export const migrateAssessmentState = (oldData: LegacyAssessmentData): AssessmentState => {
  try {
    // Start with a clean state structure
    const newState: AssessmentState = {
      currentStep: oldData.currentStep || 0,
      totalSteps: oldData.totalSteps || 0,
      responses: {},
      completed: oldData.completed || false
    };

    // Migrate responses
    const responses: AssessmentResponses = {
      ...oldData.responses,
      // Migrate process details
      ...(oldData.processDetails && {
        employees: oldData.processDetails.employees,
        industry: oldData.processDetails.industry,
        processVolume: oldData.processDetails.processVolume,
      }),
      // Migrate process metrics
      ...(oldData.processes && {
        timeSpent: oldData.processes.timeSpent,
        errorRate: oldData.processes.errorRate,
      }),
      // Migrate marketing data
      ...(oldData.marketing && {
        marketingBudget: oldData.marketing.budget,
        marketingChannels: oldData.marketing.channels,
        marketingMetrics: oldData.marketing.metrics,
      }),
    };

    // Clean up undefined values
    Object.keys(responses).forEach(key => {
      if (responses[key] === undefined) {
        delete responses[key];
      }
    });

    newState.responses = responses;

    // Validate the migrated state
    if (!validateMigratedState(newState)) {
      throw new Error('State validation failed after migration');
    }

    logger.info('Successfully migrated assessment state', {
      oldStructure: oldData,
      newStructure: newState
    });

    return newState;
  } catch (error) {
    logger.error('Failed to migrate assessment state', {
      error,
      oldData
    });
    
    // Return a safe default state if migration fails
    return {
      currentStep: 0,
      totalSteps: 0,
      responses: {},
      completed: false
    };
  }
};

/**
 * Safely retrieves a value from the old state structure
 * @param obj - The object to retrieve from
 * @param path - The path to the value
 * @param defaultValue - Default value if not found
 */
export const getNestedValue = (obj: any, path: string, defaultValue: any = undefined) => {
  try {
    return path.split('.').reduce((acc, part) => acc?.[part], obj) ?? defaultValue;
  } catch {
    return defaultValue;
  }
};

/**
 * Helper to check if we're dealing with legacy data structure
 */
export const isLegacyState = (data: any): boolean => {
  return !!(
    data &&
    (data.processDetails || data.processes || data.marketing) &&
    typeof data.responses === 'object'
  );
};
