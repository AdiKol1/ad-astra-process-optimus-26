import { StorageStrategy, AssessmentData } from '../../domain/assessment/types';
import { AssessmentError, ValidationError } from '../../utils/errors/assessment';
import { telemetry } from '../../utils/monitoring/telemetry';
import { logger } from '../../utils/logger';

export class LocalStorageStrategy implements StorageStrategy {
  private readonly prefix = 'assessment:';
  private readonly maxRetries = 3;
  private readonly retryDelay = 1000;

  private getKey(id: string): string {
    return `${this.prefix}${id}`;
  }

  private async retry<T>(operation: () => Promise<T>): Promise<T> {
    let lastError: Error | null = null;
    
    for (let i = 0; i < this.maxRetries; i++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        logger.warn('Storage operation failed, retrying...', {
          attempt: i + 1,
          maxRetries: this.maxRetries,
          error: lastError.message
        });
        await new Promise(resolve => setTimeout(resolve, this.retryDelay));
      }
    }

    telemetry.track('storage_operation_failed', {
      error: lastError?.message,
      retries: this.maxRetries
    });

    throw new AssessmentError(`Storage operation failed after ${this.maxRetries} retries: ${lastError?.message}`);
  }

  private validateData(data: AssessmentData): void {
    if (!data.id) {
      throw new ValidationError('Missing assessment ID');
    }

    if (!data.metadata) {
      throw new ValidationError('Missing assessment metadata');
    }

    if (typeof data.isComplete !== 'boolean') {
      throw new ValidationError('Invalid completion status');
    }
  }

  async save(data: AssessmentData): Promise<void> {
    const perfMark = performance.now();
    
    try {
      this.validateData(data);
      
      await this.retry(async () => {
        localStorage.setItem(this.getKey(data.id), JSON.stringify(data));
      });

      telemetry.track('assessment_state_saved', {
        id: data.id,
        duration: performance.now() - perfMark
      });
    } catch (error) {
      telemetry.track('assessment_state_save_failed', {
        id: data.id,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }

  async load(id: string): Promise<AssessmentData | null> {
    const perfMark = performance.now();
    
    try {
      const result = await this.retry(async () => {
        const data = localStorage.getItem(this.getKey(id));
        if (!data) return null;
        
        const parsed = JSON.parse(data) as AssessmentData;
        this.validateData(parsed);
        return parsed;
      });

      telemetry.track('assessment_state_loaded', {
        id,
        duration: performance.now() - perfMark,
        found: result !== null
      });

      return result;
    } catch (error) {
      telemetry.track('assessment_state_load_failed', {
        id,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }

  async clear(id: string): Promise<void> {
    try {
      await this.retry(async () => {
        localStorage.removeItem(this.getKey(id));
      });

      telemetry.track('assessment_state_cleared', { id });
    } catch (error) {
      telemetry.track('assessment_state_clear_failed', {
        id,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }
}
