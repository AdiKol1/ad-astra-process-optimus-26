import { describe, it, expect, vi, beforeEach } from 'vitest';
import { logger } from '../index';
import { telemetry } from '@/utils/monitoring/telemetry';

vi.mock('@/utils/monitoring/telemetry');

describe('Logger', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    logger.clearLogs();
    vi.spyOn(console, 'debug').mockImplementation(() => {});
    vi.spyOn(console, 'info').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('logs messages at different levels', () => {
    logger.setLogLevel('debug');

    logger.debug('Debug message');
    logger.info('Info message');
    logger.warn('Warning message');
    logger.error('Error message');

    const logs = logger.getLogs();
    expect(logs).toHaveLength(4);
    expect(logs[0].level).toBe('debug');
    expect(logs[1].level).toBe('info');
    expect(logs[2].level).toBe('warn');
    expect(logs[3].level).toBe('error');
  });

  it('respects log level settings', () => {
    logger.setLogLevel('warn');

    logger.debug('Debug message');
    logger.info('Info message');
    logger.warn('Warning message');
    logger.error('Error message');

    const logs = logger.getLogs();
    expect(logs).toHaveLength(2);
    expect(logs[0].level).toBe('warn');
    expect(logs[1].level).toBe('error');
  });

  it('includes additional data in log entries', () => {
    const testData = { key: 'value' };
    logger.info('Test message', testData);

    const logs = logger.getLogs();
    expect(logs[0].data).toEqual(testData);
  });

  it('tracks errors with telemetry', () => {
    const error = new Error('Test error');
    logger.error('Error occurred', error);

    expect(telemetry.trackError).toHaveBeenCalledWith(
      error,
      expect.any(Object)
    );
  });

  it('maintains maximum log size', () => {
    logger.setLogLevel('debug');
    
    // Fill logs beyond max size
    for (let i = 0; i < 1100; i++) {
      logger.debug(`Message ${i}`);
    }

    const logs = logger.getLogs();
    expect(logs.length).toBeLessThanOrEqual(1000);
  });

  it('exports logs in correct format', async () => {
    logger.info('Test message');
    const exported = await logger.exportLogs();
    const parsed = JSON.parse(exported);

    expect(parsed).toHaveProperty('timestamp');
    expect(parsed).toHaveProperty('environment');
    expect(parsed).toHaveProperty('logs');
    expect(Array.isArray(parsed.logs)).toBe(true);
  });

  it('clears logs correctly', () => {
    logger.info('Test message');
    expect(logger.getLogs()).toHaveLength(1);

    logger.clearLogs();
    expect(logger.getLogs()).toHaveLength(0);
  });

  it('handles undefined data gracefully', () => {
    logger.info('Test message');
    logger.warn('Test warning');
    logger.error('Test error');

    const logs = logger.getLogs();
    logs.forEach(log => {
      expect(log).toHaveProperty('timestamp');
      expect(log).toHaveProperty('level');
      expect(log).toHaveProperty('message');
    });
  });
});
