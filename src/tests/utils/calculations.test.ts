import { calculateProcessMetrics, validateProcessMetrics } from '@/utils/assessment/process/calculations';
import { calculateMarketingMetrics, validateMarketingMetrics } from '@/utils/assessment/marketing/calculations';
import { transformProcessData } from '@/utils/assessment/adapters';
import { ProcessMetrics } from '@/types/assessment/process';
import { MarketingMetrics } from '@/types/assessment/marketing';

describe('Process Calculations', () => {
  const mockProcessMetrics: ProcessMetrics = {
    timeSpent: 40,
    errorRate: 5,
    processVolume: 1000,
    manualProcessCount: 3,
    industry: 'Technology'
  };

  it('calculates process metrics correctly', () => {
    const results = calculateProcessMetrics(mockProcessMetrics);
    
    // Test costs
    expect(results.costs.current).toBeGreaterThan(0);
    expect(results.costs.projected).toBeLessThan(results.costs.current);
    expect(results.costs.breakdown.labor.current).toBeGreaterThan(0);
    expect(results.costs.breakdown.error.current).toBeGreaterThan(0);
    expect(results.costs.breakdown.overhead.current).toBeGreaterThan(0);

    // Test savings
    expect(results.savings.monthly).toBeGreaterThan(0);
    expect(results.savings.annual).toBe(results.savings.monthly * 12);
    expect(results.savings.breakdown.labor).toBeGreaterThan(0);
    expect(results.savings.breakdown.error).toBeGreaterThan(0);
    expect(results.savings.breakdown.overhead).toBeGreaterThan(0);

    // Test metrics
    expect(results.metrics.efficiency).toBeGreaterThan(0);
    expect(results.metrics.efficiency).toBeLessThanOrEqual(1);
    expect(results.metrics.errorReduction).toBeGreaterThan(0);
    expect(results.metrics.errorReduction).toBeLessThanOrEqual(1);
    expect(results.metrics.roi).toBeGreaterThan(0);
    expect(results.metrics.paybackPeriodMonths).toBeGreaterThan(0);
  });

  it('validates process metrics correctly', () => {
    // Valid cases
    expect(validateProcessMetrics(mockProcessMetrics)).toBe(true);
    
    // Test missing fields
    expect(validateProcessMetrics({})).toBe(false);
    expect(validateProcessMetrics({ ...mockProcessMetrics, timeSpent: undefined })).toBe(false);
    
    // Test invalid numeric values
    expect(validateProcessMetrics({ ...mockProcessMetrics, timeSpent: NaN })).toBe(false);
    expect(validateProcessMetrics({ ...mockProcessMetrics, timeSpent: -1 })).toBe(false);
    expect(validateProcessMetrics({ ...mockProcessMetrics, processVolume: -1 })).toBe(false);
    expect(validateProcessMetrics({ ...mockProcessMetrics, manualProcessCount: -1 })).toBe(false);
    
    // Test invalid industry
    expect(validateProcessMetrics({ ...mockProcessMetrics, industry: 'Invalid' })).toBe(false);
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
  const mockMarketingData: MarketingMetrics = {
    toolStack: ['CRM system', 'Email marketing platform'],
    automationLevel: '26-50%',
    marketingBudget: 50000,
    industry: 'Technology'
  };

  it('calculates marketing metrics correctly', () => {
    const results = calculateMarketingMetrics(mockMarketingData);
    
    // Test costs
    expect(results.costs.current).toBeGreaterThan(0);
    expect(results.costs.projected).toBeLessThan(results.costs.current);
    expect(results.costs.breakdown.labor.current).toBeGreaterThan(0);
    expect(results.costs.breakdown.tools.current).toBeGreaterThan(0);
    expect(results.costs.breakdown.overhead.current).toBeGreaterThan(0);

    // Test savings
    expect(results.savings.monthly).toBeGreaterThan(0);
    expect(results.savings.annual).toBe(results.savings.monthly * 12);
    expect(results.savings.breakdown.labor).toBeGreaterThan(0);
    expect(results.savings.breakdown.tools).toBeGreaterThan(0);
    expect(results.savings.breakdown.overhead).toBeGreaterThan(0);

    // Test metrics
    expect(results.metrics.efficiency).toBeGreaterThan(0);
    expect(results.metrics.efficiency).toBeLessThanOrEqual(1);
    expect(results.metrics.automationLevel).toBeGreaterThan(0);
    expect(results.metrics.automationLevel).toBeLessThanOrEqual(1);
    expect(results.metrics.roi).toBeGreaterThan(0);
    expect(results.metrics.paybackPeriodMonths).toBeGreaterThan(0);
  });

  it('validates marketing metrics correctly', () => {
    // Valid cases
    expect(validateMarketingMetrics(mockMarketingData)).toBe(true);
    
    // Test missing fields
    expect(validateMarketingMetrics({})).toBe(false);
    expect(validateMarketingMetrics({ ...mockMarketingData, toolStack: undefined })).toBe(false);
    
    // Test invalid values
    expect(validateMarketingMetrics({ ...mockMarketingData, marketingBudget: -1 })).toBe(false);
    expect(validateMarketingMetrics({ ...mockMarketingData, toolStack: [] })).toBe(false);
    expect(validateMarketingMetrics({ ...mockMarketingData, automationLevel: '50%' })).toBe(false);
    expect(validateMarketingMetrics({ ...mockMarketingData, industry: 'Invalid' })).toBe(false);
  });
});
