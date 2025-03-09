import type { AssessmentDomain } from '@/types/assessment/domain';
import { logger } from '@/utils/logger';
import { telemetry } from '@/utils/monitoring/telemetry';

export interface StorageStrategy {
  save(data: AssessmentDomain): Promise<void>;
  load(): Promise<AssessmentDomain | null>;
  clear(): Promise<void>;
}

export class LocalStorageStrategy implements StorageStrategy {
  private readonly key: string;
  private readonly version: string;

  constructor(key: string = 'assessment', version: string = '1.0.0') {
    this.key = key;
    this.version = version;
  }

  async save(data: AssessmentDomain): Promise<void> {
    try {
      const serializedData = JSON.stringify({
        ...data,
        metadata: {
          ...data.data.metadata,
          version: this.version,
          lastUpdated: new Date().toISOString()
        }
      });

      localStorage.setItem(this.key, serializedData);
      
      telemetry.track('assessment_storage_save', {
        success: true,
        timestamp: new Date().toISOString()
      });
      
      logger.info('Assessment data saved to localStorage', {
        key: this.key,
        version: this.version
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      telemetry.track('assessment_storage_error', {
        operation: 'save',
        error: errorMessage,
        timestamp: new Date().toISOString()
      });
      
      logger.error('Failed to save assessment data', {
        error: errorMessage,
        key: this.key
      });
      
      throw new Error(`Failed to save assessment data: ${errorMessage}`);
    }
  }

  async load(): Promise<AssessmentDomain | null> {
    try {
      const serializedData = localStorage.getItem(this.key);
      
      if (!serializedData) {
        logger.info('No assessment data found in localStorage', {
          key: this.key
        });
        return null;
      }

      const data = JSON.parse(serializedData) as AssessmentDomain;
      
      // Version check
      if (data.data.metadata.version !== this.version) {
        logger.warn('Assessment data version mismatch', {
          stored: data.data.metadata.version,
          current: this.version
        });
        return null;
      }

      telemetry.track('assessment_storage_load', {
        success: true,
        timestamp: new Date().toISOString()
      });
      
      logger.info('Assessment data loaded from localStorage', {
        key: this.key,
        version: this.version
      });

      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      telemetry.track('assessment_storage_error', {
        operation: 'load',
        error: errorMessage,
        timestamp: new Date().toISOString()
      });
      
      logger.error('Failed to load assessment data', {
        error: errorMessage,
        key: this.key
      });
      
      throw new Error(`Failed to load assessment data: ${errorMessage}`);
    }
  }

  async clear(): Promise<void> {
    try {
      localStorage.removeItem(this.key);
      
      telemetry.track('assessment_storage_clear', {
        success: true,
        timestamp: new Date().toISOString()
      });
      
      logger.info('Assessment data cleared from localStorage', {
        key: this.key
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      telemetry.track('assessment_storage_error', {
        operation: 'clear',
        error: errorMessage,
        timestamp: new Date().toISOString()
      });
      
      logger.error('Failed to clear assessment data', {
        error: errorMessage,
        key: this.key
      });
      
      throw new Error(`Failed to clear assessment data: ${errorMessage}`);
    }
  }
} 