import { describe, test, expect } from 'vitest';
import { calculateProcessMetrics } from '../processAssessment/calculations';

describe('Automation Potential Calculations', () => {
  test('Healthcare industry calculations', () => {
    const metrics = {
      employees: '10',
      timeSpent: '40',
      processVolume: '100-200',
      errorRate: '2%',
      industry: 'Healthcare',
      implementationCost: '50000'
    };

    const result = calculateProcessMetrics(metrics);
    expect(result.savings.annual).toBeGreaterThan(0);
    expect(result.costs.projected).toBeLessThan(result.costs.current);
    expect(result.metrics.efficiency).toBeGreaterThan(0);
  });

  test('Financial Services industry calculations', () => {
    const metrics = {
      employees: '15',
      timeSpent: '35',
      processVolume: '200-300',
      errorRate: '1.5%',
      industry: 'Financial',
      implementationCost: '75000'
    };

    const result = calculateProcessMetrics(metrics);
    expect(result.savings.annual).toBeGreaterThan(0);
    expect(result.costs.projected).toBeLessThan(result.costs.current);
    expect(result.metrics.efficiency).toBeGreaterThan(0);
  });

  test('Edge cases', () => {
    const metrics = {
      employees: '1',
      timeSpent: '5',
      processVolume: '10-20',
      errorRate: '0.5%',
      industry: 'Other',
      implementationCost: '10000'
    };

    const result = calculateProcessMetrics(metrics);
    expect(result.savings.annual).toBeGreaterThan(0);
    expect(result.costs.projected).toBeLessThan(result.costs.current);
    expect(result.metrics.efficiency).toBeGreaterThan(0);
  });

  test('Savings calculations validation', () => {
    const metrics = {
      employees: '20',
      timeSpent: '10',
      processVolume: '100-500',
      errorRate: '1-3%',
      industry: 'Technology',
      implementationCost: '120000'
    };

    const result = calculateProcessMetrics(metrics);
    expect(result.savings.annual).toBeGreaterThan(0);
    expect(result.savings.monthly * 12).toBeCloseTo(result.savings.annual, -2);
    expect(result.metrics.roi).toBeGreaterThan(0);
  });
});
