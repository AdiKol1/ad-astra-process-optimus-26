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

    expect(results).toHaveProperty('score');
    expect(results).toHaveProperty('teamScore');
    expect(results).toHaveProperty('recommendations');
    expect(results.score).toBeGreaterThanOrEqual(0);
    expect(results.score).toBeLessThanOrEqual(100);
    expect(results.teamScore).toBeGreaterThanOrEqual(0);
    expect(Array.isArray(results.recommendations)).toBe(true);
  });

  it('validates process metrics correctly', () => {
    expect(validateProcessMetrics(mockProcessMetrics)).toBe(true);

    expect(validateProcessMetrics({})).toBe(false);
    expect(validateProcessMetrics({ ...mockProcessMetrics, timeSpent: undefined })).toBe(false);
    expect(validateProcessMetrics({ ...mockProcessMetrics, timeSpent: NaN })).toBe(false);
    expect(validateProcessMetrics({ ...mockProcessMetrics, timeSpent: -1 })).toBe(false);
    expect(validateProcessMetrics({ ...mockProcessMetrics, processVolume: -1 })).toBe(false);
    expect(validateProcessMetrics({ ...mockProcessMetrics, manualProcessCount: -1 })).toBe(false);
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
    expect(transformed.errorRate).toBe(4);
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

    expect(results.costs.current).toBeGreaterThan(0);
    expect(results.costs.projected).toBeLessThan(results.costs.current);
    expect(results.costs.breakdown.labor.current).toBeGreaterThan(0);
    expect(results.costs.breakdown.tools.current).toBeGreaterThan(0);
    expect(results.costs.breakdown.overhead.current).toBeGreaterThan(0);

    expect(results.savings.monthly).toBeGreaterThan(0);
    expect(results.savings.annual).toBe(results.savings.monthly * 12);

    expect(results.metrics.efficiency).toBeGreaterThan(0);
    expect(results.metrics.efficiency).toBeLessThanOrEqual(1);
    expect(results.metrics.automationLevel).toBeGreaterThan(0);
    expect(results.metrics.automationLevel).toBeLessThanOrEqual(1);
    expect(results.metrics.roi).toBeGreaterThan(0);
    expect(results.metrics.paybackPeriodMonths).toBeGreaterThan(0);
  });

  it('validates marketing metrics correctly', () => {
    // validateMarketingMetrics returns a validated object, not a boolean
    const validated = validateMarketingMetrics(mockMarketingData);
    expect(validated.toolStack).toEqual(mockMarketingData.toolStack);
    expect(validated.automationLevel).toBe(mockMarketingData.automationLevel);
    expect(validated.marketingBudget).toBe(mockMarketingData.marketingBudget);
    expect(validated.industry).toBe(mockMarketingData.industry);

    // Invalid inputs fall back to defaults
    const fromEmpty = validateMarketingMetrics({});
    expect(fromEmpty.toolStack).toEqual([]);
    expect(fromEmpty.marketingBudget).toBe(5000);

    const fromInvalidBudget = validateMarketingMetrics({ ...mockMarketingData, marketingBudget: -1 });
    expect(fromInvalidBudget.marketingBudget).toBe(5000);

    const fromInvalidIndustry = validateMarketingMetrics({ ...mockMarketingData, industry: 'Invalid' as any });
    expect(fromInvalidIndustry.industry).toBe('Other');
  });
});
