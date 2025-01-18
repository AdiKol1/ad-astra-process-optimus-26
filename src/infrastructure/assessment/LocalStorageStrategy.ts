import { StorageStrategy, AssessmentData } from '@/domain/assessment/types';
import { encrypt, decrypt } from '@/utils/encryption';

export class LocalStorageStrategy implements StorageStrategy {
  private readonly prefix = 'assessment:';
  private readonly maxRetries = 3;
  private readonly retryDelay = 1000;

  constructor(private readonly encryptionKey: string) {}

  private getKey(id: string): string {
    return `${this.prefix}${id}`;
  }

  private async retry<T>(operation: () => Promise<T>): Promise<T> {
    let lastError: Error;
    
    for (let i = 0; i < this.maxRetries; i++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        await new Promise(resolve => setTimeout(resolve, this.retryDelay));
      }
    }

    throw lastError!;
  }

  async save(data: AssessmentData): Promise<void> {
    await this.retry(async () => {
      const encrypted = await encrypt(JSON.stringify(data), this.encryptionKey);
      localStorage.setItem(this.getKey(data.id), encrypted);
    });
  }

  async load(id: string): Promise<AssessmentData | null> {
    return this.retry(async () => {
      const encrypted = localStorage.getItem(this.getKey(id));
      if (!encrypted) return null;

      const decrypted = await decrypt(encrypted, this.encryptionKey);
      return JSON.parse(decrypted) as AssessmentData;
    });
  }

  async clear(id: string): Promise<void> {
    await this.retry(async () => {
      localStorage.removeItem(this.getKey(id));
    });
  }
}
