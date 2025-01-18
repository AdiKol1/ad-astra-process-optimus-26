import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useOfflineSupport } from '../useOfflineSupport';
import { offlineStorage } from '@/utils/offline/storage';
import { telemetry } from '@/utils/monitoring/telemetry';

vi.mock('@/utils/offline/storage');
vi.mock('@/utils/monitoring/telemetry');

describe('useOfflineSupport', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    
    // Reset online status
    Object.defineProperty(navigator, 'onLine', {
      value: true,
      writable: true
    });
  });

  it('initializes with correct online status', () => {
    const { result } = renderHook(() => useOfflineSupport());
    
    expect(result.current.isOnline).toBe(true);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.syncStatus).toEqual({
      syncing: false,
      pendingItems: 0
    });
  });

  it('handles offline/online transitions', async () => {
    const { result } = renderHook(() => useOfflineSupport());

    // Simulate going offline
    act(() => {
      Object.defineProperty(navigator, 'onLine', { value: false });
      window.dispatchEvent(new Event('offline'));
    });

    expect(result.current.isOnline).toBe(false);
    expect(telemetry.trackEvent).toHaveBeenCalledWith('connection_lost');

    // Simulate going online
    act(() => {
      Object.defineProperty(navigator, 'onLine', { value: true });
      window.dispatchEvent(new Event('online'));
    });

    expect(result.current.isOnline).toBe(true);
    expect(telemetry.trackEvent).toHaveBeenCalledWith('connection_restored');
  });

  it('saves data offline', async () => {
    const { result } = renderHook(() => useOfflineSupport());
    const testData = { test: 'data' };

    await act(async () => {
      await result.current.saveOffline('test-id', testData);
    });

    expect(offlineStorage.store).toHaveBeenCalledWith('test-id', testData);
  });

  it('retrieves offline data', async () => {
    const { result } = renderHook(() => useOfflineSupport());
    const testData = { test: 'data' };

    vi.mocked(offlineStorage.retrieve).mockReturnValue(testData);

    const data = result.current.getOfflineData('test-id');
    expect(data).toEqual(testData);
    expect(offlineStorage.retrieve).toHaveBeenCalledWith('test-id');
  });

  it('syncs when online', async () => {
    const { result } = renderHook(() => useOfflineSupport());

    await act(async () => {
      await result.current.syncWhenOnline();
    });

    expect(offlineStorage.syncPendingItems).toHaveBeenCalled();
    expect(telemetry.trackEvent).toHaveBeenCalledWith('sync_completed');
  });

  it('handles sync errors gracefully', async () => {
    const { result } = renderHook(() => useOfflineSupport());
    const error = new Error('Sync failed');

    vi.mocked(offlineStorage.syncPendingItems).mockRejectedValueOnce(error);

    await act(async () => {
      await result.current.syncWhenOnline();
    });

    expect(telemetry.trackError).toHaveBeenCalledWith(error);
  });

  it('prevents sync when offline', async () => {
    const { result } = renderHook(() => useOfflineSupport());

    act(() => {
      Object.defineProperty(navigator, 'onLine', { value: false });
      window.dispatchEvent(new Event('offline'));
    });

    await act(async () => {
      await result.current.syncWhenOnline();
    });

    expect(offlineStorage.syncPendingItems).not.toHaveBeenCalled();
  });

  it('updates sync status on storage changes', async () => {
    const { result } = renderHook(() => useOfflineSupport());
    const newStatus = { syncing: true, pendingItems: 5 };

    vi.mocked(offlineStorage.getSyncStatus).mockReturnValue(newStatus);

    act(() => {
      window.dispatchEvent(new CustomEvent('offlineStorageChange'));
    });

    expect(result.current.syncStatus).toEqual(newStatus);
  });
});
