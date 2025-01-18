import { NetworkStrategy, AssessmentData, ValidationError } from '@/domain/assessment/types';
import { logger } from '@/utils/logger';

export class ApiNetworkStrategy implements NetworkStrategy {
  constructor(
    private readonly apiUrl: string,
    private readonly fetchWithRetry: typeof fetch
  ) {}

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Network error' }));
      throw new Error(error.message || 'Network request failed');
    }
    return response.json();
  }

  async submit(data: AssessmentData): Promise<void> {
    try {
      const response = await this.fetchWithRetry(`${this.apiUrl}/assessment/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      await this.handleResponse(response);
    } catch (error) {
      logger.error('Failed to submit assessment:', error);
      throw error;
    }
  }

  async validate(data: Partial<AssessmentData>): Promise<ValidationError[]> {
    try {
      const response = await this.fetchWithRetry(`${this.apiUrl}/assessment/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      return this.handleResponse<ValidationError[]>(response);
    } catch (error) {
      logger.error('Failed to validate assessment:', error);
      throw error;
    }
  }
}
