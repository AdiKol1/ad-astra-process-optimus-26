import { useState, useEffect, useCallback } from 'react';
import { offlineStorage } from '../utils/offline/storage';
import { logger } from '../utils/logger';
import { telemetry } from '../utils/monitoring/telemetry';

export interface OfflineSupportHook {
  isOnline: boolean;
  isLoading: boolean;
  syncStatus: {
    syncing: boolean;
    pendingItems: number;
  };
  syncWhenOnline: () => Promise<void>;
  saveOffline: <T>(id: string, data: T) => Promise<void>;
  getOfflineData: <T>(id: string) => T | null;
}

export const useOfflineSupport = (): OfflineSupportHook => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isLoading, setIsLoading] = useState(false);
  const [syncStatus, setSyncStatus] = useState(offlineStorage.getSyncStatus());

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      telemetry.trackEvent('connection_restored');
    };

    const handleOffline = () => {
      setIsOnline(false);
      telemetry.trackEvent('connection_lost');
    };

    const handleStorageChange = () => {
      setSyncStatus(offlineStorage.getSyncStatus());
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('offlineStorageChange', handleStorageChange);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('offlineStorageChange', handleStorageChange);
    };
  }, []);

  const syncWhenOnline = useCallback(async () => {
    if (!isOnline) {
      logger.warn('Cannot sync while offline');
      return;
    }

    setIsLoading(true);
    try {
      await offlineStorage.syncPendingItems();
      setSyncStatus(offlineStorage.getSyncStatus());
      telemetry.trackEvent('sync_completed');
    } catch (error) {
      logger.error('Sync failed', error);
      telemetry.trackError(error);
    } finally {
      setIsLoading(false);
    }
  }, [isOnline]);

  const saveOffline = useCallback(async <T>(id: string, data: T) => {
    setIsLoading(true);
    try {
      await offlineStorage.store(id, data);
      setSyncStatus(offlineStorage.getSyncStatus());
      
      if (isOnline) {
        await syncWhenOnline();
      }
    } catch (error) {
      logger.error('Failed to save offline', error);
      telemetry.trackError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [isOnline, syncWhenOnline]);

  const getOfflineData = useCallback(<T>(id: string): T | null => {
    try {
      return offlineStorage.retrieve<T>(id);
    } catch (error) {
      logger.error('Failed to retrieve offline data', error);
      telemetry.trackError(error);
      return null;
    }
  }, []);

  return {
    isOnline,
    isLoading,
    syncStatus,
    syncWhenOnline,
    saveOffline,
    getOfflineData
  };
};
