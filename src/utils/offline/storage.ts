import { logger } from '../logger';
import { telemetry } from '../monitoring/telemetry';

export interface StorageItem<T> {
  id: string;
  data: T;
  timestamp: number;
  synced: boolean;
}

class OfflineStorage {
  private readonly storageKey = 'assessment_offline_storage';
  private readonly syncQueue: Set<string> = new Set();
  private isSyncing = false;

  constructor() {
    this.setupStorageListener();
    this.setupOnlineListener();
  }

  private setupStorageListener() {
    window.addEventListener('storage', (e) => {
      if (e.key === this.storageKey) {
        this.notifyStorageChange();
      }
    });
  }

  private setupOnlineListener() {
    window.addEventListener('online', () => {
      logger.info('Connection restored, starting sync');
      this.syncPendingItems();
    });

    window.addEventListener('offline', () => {
      logger.warn('Connection lost, switching to offline mode');
      telemetry.trackEvent('offline_mode_activated');
    });
  }

  private getStorage<T>(): StorageItem<T>[] {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      logger.error('Error reading from storage', error);
      return [];
    }
  }

  private setStorage<T>(items: StorageItem<T>[]) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(items));
      this.notifyStorageChange();
    } catch (error) {
      logger.error('Error writing to storage', error);
      throw error;
    }
  }

  private notifyStorageChange() {
    window.dispatchEvent(new CustomEvent('offlineStorageChange'));
  }

  public async store<T>(id: string, data: T): Promise<void> {
    try {
      const items = this.getStorage<T>();
      const timestamp = Date.now();
      
      const existingIndex = items.findIndex(item => item.id === id);
      if (existingIndex >= 0) {
        items[existingIndex] = { id, data, timestamp, synced: false };
      } else {
        items.push({ id, data, timestamp, synced: false });
      }

      this.setStorage(items);
      this.syncQueue.add(id);

      if (navigator.onLine) {
        await this.syncPendingItems();
      }

      telemetry.trackEvent('offline_storage_write', { id });
    } catch (error) {
      logger.error('Error storing data', error);
      throw error;
    }
  }

  public retrieve<T>(id: string): T | null {
    try {
      const items = this.getStorage<T>();
      const item = items.find(item => item.id === id);
      return item ? item.data : null;
    } catch (error) {
      logger.error('Error retrieving data', error);
      return null;
    }
  }

  public async syncPendingItems(): Promise<void> {
    if (this.isSyncing || !navigator.onLine || this.syncQueue.size === 0) {
      return;
    }

    this.isSyncing = true;
    const items = this.getStorage();

    try {
      const promises = Array.from(this.syncQueue).map(async (id) => {
        const item = items.find(i => i.id === id);
        if (!item) return;

        try {
          // Implement your sync logic here
          // await api.sync(item.data);
          
          item.synced = true;
          this.syncQueue.delete(id);
          
          telemetry.trackEvent('offline_storage_sync_success', { id });
        } catch (error) {
          logger.error('Error syncing item', error, { id });
          telemetry.trackError(error, { id });
        }
      });

      await Promise.all(promises);
      this.setStorage(items);
    } catch (error) {
      logger.error('Error during sync', error);
      throw error;
    } finally {
      this.isSyncing = false;
    }
  }

  public clear(): void {
    try {
      localStorage.removeItem(this.storageKey);
      this.syncQueue.clear();
      this.notifyStorageChange();
    } catch (error) {
      logger.error('Error clearing storage', error);
      throw error;
    }
  }

  public getSyncStatus(): { syncing: boolean; pendingItems: number } {
    return {
      syncing: this.isSyncing,
      pendingItems: this.syncQueue.size
    };
  }
}

export const offlineStorage = new OfflineStorage();
