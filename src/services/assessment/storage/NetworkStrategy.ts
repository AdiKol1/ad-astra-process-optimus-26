import type { AssessmentDomain } from '@/types/assessment/domain';
import type { StorageStrategy } from './LocalStorageStrategy';
import { logger } from '@/utils/logger';
import { telemetry } from '@/utils/monitoring/telemetry';

export class NetworkStrategy implements StorageStrategy {
  private readonly endpoint: string;
  private readonly apiKey: string;

  constructor(endpoint: string, apiKey: string) {
    this.endpoint = endpoint;
    this.apiKey = apiKey;
  }

  async save(data: AssessmentDomain): Promise<void> {
    try {
      const response = await fetch(`${this.endpoint}/assessment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }

      telemetry.track('assessment_network_save', {
        success: true,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error('Failed to save assessment data to network', { error: errorMessage });
      throw error;
    }
  }

  async load(): Promise<AssessmentDomain | null> {
    try {
      const response = await fetch(`${this.endpoint}/assessment`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }

      const data = await response.json();
      
      telemetry.track('assessment_network_load', {
        success: true,
        timestamp: new Date().toISOString()
      });

      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error('Failed to load assessment data from network', { error: errorMessage });
      return null;
    }
  }

  async clear(): Promise<void> {
    try {
      const response = await fetch(`${this.endpoint}/assessment`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }

      telemetry.track('assessment_network_clear', {
        success: true,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error('Failed to clear assessment data from network', { error: errorMessage });
      throw error;
    }
  }
} 