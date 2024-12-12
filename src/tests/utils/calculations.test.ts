import { calculateProcessMetrics, validateProcessMetrics } from '@/utils/assessment/process/calculations';
import { calculateMarketingMetrics, validateMarketingMetrics } from '@/utils/assessment/marketing/calculations';
import { transformProcessData } from '@/utils/assessment/adapters';

describe('Process Calculations', () => {
  const mockProcessMetrics = {
    timeSpent: 40,
    errorRate: 5,
    processVolume: 1000,
    manualProcessCount: 3,
    industry: 'Technology'
  };

  it('calculates process metrics correctly', () => {
    const results = calculateProcessMetrics(mockProcessMetrics);
    
    expect(results.costs.current).toBeGreaterThan(0);
    expect(results.savings.monthly).toBeGreaterThan(0);
    expect(results.metrics.efficiency).toBeLessThanOrEqual(100);
    expect(results.metrics.errorReduction).toBeLessThanOrEqual(100);
  });

  it('validates process metrics correctly', () => {
    expect(validateProcessMetrics(mockProcessMetrics)).toBe(true);
    expect(validateProcessMetrics({ ...mockProcessMetrics, timeSpent: -1 })).toBe(false);
    expect(validateProcessMetrics({ ...mockProcessMetrics, errorRate: 101 })).toBe(false);
  });

  it('transforms process data correctly', () => {
    const mockResponses = {
      timeSpent: 40,
      errorRate: '3-5%',
      processVolume: '1000',
      manualProcesses: ['process1', 'process2', 'process3'],
      industry: 'Technology'
    };

    const transformed = transformProcessData(mockResponses);
    
    expect(transformed.timeSpent).toBe(40);
    expect(transformed.errorRate).toBe(4); // Average of 3-5
    expect(transformed.processVolume).toBe(1000);
    expect(transformed.manualProcessCount).toBe(3);
    expect(transformed.industry).toBe('Technology');
  });
});

describe('Marketing Calculations', () => {
  const mockMarketingData = {
    toolStack: ['CRM system', 'Email marketing platform'],
    automationLevel: '26-50%',
    marketingChallenges: ['Campaign automation', 'Performance tracking'],
    metricsTracking: ['ROI', 'Conversion rate'],
    marketingBudget: '$5,000 - $20,000'
  };

  it('calculates marketing metrics correctly', () => {
    const metrics = calculateMarketingMetrics(mockMarketingData);
    
    expect(metrics.toolMaturity).toBeLessThanOrEqual(100);
    expect(metrics.automationLevel).toBeLessThanOrEqual(100);
    expect(metrics.processMaturity).toBeLessThanOrEqual(100);
    expect(metrics.budgetEfficiency).toBeLessThanOrEqual(100);
    expect(metrics.integrationLevel).toBeLessThanOrEqual(100);
  });

  it('validates marketing metrics correctly', () => {
    const metrics = calculateMarketingMetrics(mockMarketingData);
    expect(validateMarketingMetrics(metrics)).toBe(true);
    
    const invalidMetrics = { ...metrics, toolMaturity: 101 };
    expect(validateMarketingMetrics(invalidMetrics)).toBe(false);
  });

  it('handles missing data gracefully', () => {
    const incompleteData = {
      toolStack: ['CRM system'],
      automationLevel: '0-25%'
    };

    const metrics = calculateMarketingMetrics(incompleteData);
    expect(metrics.toolMaturity).toBeGreaterThan(0);
    expect(metrics.automationLevel).toBeGreaterThan(0);
  });
});
