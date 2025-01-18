import { describe, it, expect, vi, beforeEach } from 'vitest';
import { offlineStorage } from '../storage';
import { telemetry } from '@/utils/monitoring/telemetry';

vi.mock('@/utils/monitoring/telemetry');

describe('OfflineStorage', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('stores and retrieves data correctly', async () => {
    const testData = { test: 'data' };
    await offlineStorage.store('test-id', testData);

    const retrieved = offlineStorage.retrieve('test-id');
    expect(retrieved).toEqual(testData);
  });

  it('handles updates to existing items', async () => {
    const initialData = { test: 'initial' };
    const updatedData = { test: 'updated' };

    await offlineStorage.store('test-id', initialData);
    await offlineStorage.store('test-id', updatedData);

    const retrieved = offlineStorage.retrieve('test-id');
    expect(retrieved).toEqual(updatedData);
  });

  it('tracks sync status correctly', async () => {
    const testData = { test: 'data' };
    await offlineStorage.store('test-id', testData);

    const status = offlineStorage.getSyncStatus();
    expect(status.pendingItems).toBeGreaterThan(0);
    expect(status.syncing).toBe(false);
  });

  it('handles offline/online transitions', async () => {
    // Simulate going offline
    Object.defineProperty(navigator, 'onLine', { value: false });
    window.dispatchEvent(new Event('offline'));

    const testData = { test: 'offline-data' };
    await offlineStorage.store('offline-id', testData);

    expect(telemetry.trackEvent).toHaveBeenCalledWith(
      'offline_mode_activated'
    );

    // Simulate going online
    Object.defineProperty(navigator, 'onLine', { value: true });
    window.dispatchEvent(new Event('online'));

    // Wait for sync attempt
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(telemetry.trackEvent).toHaveBeenCalledWith(
      'offline_storage_write',
      expect.any(Object)
    );
  });

  it('clears storage correctly', async () => {
    const testData = { test: 'data' };
    await offlineStorage.store('test-id', testData);
    
    offlineStorage.clear();
    
    const retrieved = offlineStorage.retrieve('test-id');
    expect(retrieved).toBeNull();

    const status = offlineStorage.getSyncStatus();
    expect(status.pendingItems).toBe(0);
  });

  it('handles storage errors gracefully', async () => {
    // Mock localStorage to throw error
    const mockError = new Error('Storage error');
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw mockError;
    });

    const testData = { test: 'data' };
    await expect(offlineStorage.store('test-id', testData)).rejects.toThrow();

    expect(telemetry.trackError).toHaveBeenCalledWith(
      expect.any(Error),
      expect.any(Object)
    );
  });

  it('maintains data consistency across multiple operations', async () => {
    const items = [
      { id: 'item1', data: { value: 1 } },
      { id: 'item2', data: { value: 2 } },
      { id: 'item3', data: { value: 3 } }
    ];

    // Store multiple items
    await Promise.all(items.map(item => 
      offlineStorage.store(item.id, item.data)
    ));

    // Verify all items
    items.forEach(item => {
      const retrieved = offlineStorage.retrieve(item.id);
      expect(retrieved).toEqual(item.data);
    });

    // Update one item
    const updatedItem = { value: 4 };
    await offlineStorage.store('item2', updatedItem);

    // Verify update
    expect(offlineStorage.retrieve('item2')).toEqual(updatedItem);

    // Verify other items remained unchanged
    expect(offlineStorage.retrieve('item1')).toEqual({ value: 1 });
    expect(offlineStorage.retrieve('item3')).toEqual({ value: 3 });
  });
});
