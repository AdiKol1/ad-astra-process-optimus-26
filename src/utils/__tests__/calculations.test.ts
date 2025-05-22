import { describe, test, expect } from 'vitest';
import { calculateProcessMetrics } from '../processAssessment/calculations';

describe('Automation Potential Calculations', () => {
  test('Healthcare industry calculations', () => {
    const metrics = {
      timeSpent: ['1-2 hours'],
      errorRate: ['1-2%'],
      processVolume: '100-500',
      industry: 'Healthcare'
    };

    const result = calculateProcessMetrics(metrics);
    expect(result).toHaveProperty('timeSpent');
    expect(result).toHaveProperty('errorRate');
    expect(result).toHaveProperty('processVolume');
    expect(typeof result.timeSpent).toBe('number');
    expect(typeof result.errorRate).toBe('number');
    expect(typeof result.processVolume).toBe('number');
  });

  test('Financial Services industry calculations', () => {
    const metrics = {
      timeSpent: ['2-4 hours'],
      errorRate: ['1-2%'],
      processVolume: '501-1000',
      industry: 'Financial'
    };

    const result = calculateProcessMetrics(metrics);
    expect(result).toHaveProperty('timeSpent');
    expect(result).toHaveProperty('errorRate');
    expect(result).toHaveProperty('processVolume');
    expect(typeof result.timeSpent).toBe('number');
    expect(typeof result.errorRate).toBe('number');
    expect(typeof result.processVolume).toBe('number');
  });

  test('Edge cases', () => {
    const metrics = {
      timeSpent: ['Less than 1 hour'],
      errorRate: ['Less than 1%'],
      processVolume: 'Less than 100',
      industry: 'Other'
    };

    const result = calculateProcessMetrics(metrics);
    expect(result).toHaveProperty('timeSpent');
    expect(result).toHaveProperty('errorRate');
    expect(result).toHaveProperty('processVolume');
    expect(typeof result.timeSpent).toBe('number');
    expect(typeof result.errorRate).toBe('number');
    expect(typeof result.processVolume).toBe('number');
  });

  test('Savings calculations validation', () => {
    const metrics = {
      timeSpent: ['1-2 hours'],
      errorRate: ['1-2%'],
      processVolume: '1001-5000',
      industry: 'Technology'
    };

    const result = calculateProcessMetrics(metrics);
    expect(result).toHaveProperty('timeSpent');
    expect(result).toHaveProperty('errorRate');
    expect(result).toHaveProperty('processVolume');
    expect(typeof result.timeSpent).toBe('number');
    expect(typeof result.errorRate).toBe('number');
    expect(typeof result.processVolume).toBe('number');
  });
});
