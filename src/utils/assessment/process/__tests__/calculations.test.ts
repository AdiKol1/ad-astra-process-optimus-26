import { calculateProcessMetrics } from '../calculations';
import { transformProcessData } from '../adapters';
import { AssessmentResponses } from '@/types/assessment';
import { ProcessMetrics } from '@/types/assessment/process';

describe('Process Calculations', () => {
  describe('transformProcessData', () => {
    it('handles null/undefined responses', () => {
      const result = transformProcessData(null as unknown as AssessmentResponses);
      expect(result).toEqual({
        timeSpent: 0,
        errorRate: 0,
        processVolume: 0,
        manualProcessCount: 0,
        industry: 'default'
      });
    });

    it('transforms typical responses correctly', () => {
      const responses: AssessmentResponses = {
        timeWasted: '10-20 hours',
        errorImpact: '$1,000 - $5,000',
        processVolume: 'Medium',
        painPoints: ['manual1', 'manual2'],
        industry: 'Technology'
      };

      const result = transformProcessData(responses);
      expect(result.timeSpent).toBe(15);
      expect(result.processVolume).toBe(250);
      expect(result.manualProcessCount).toBe(2);
      expect(result.industry).toBe('Technology');
      expect(result.errorRate).toBeGreaterThan(0);
      expect(result.errorRate).toBeLessThan(1);
    });

    it('handles extreme values', () => {
      const responses: AssessmentResponses = {
        timeWasted: 'More than 40 hours',
        errorImpact: 'More than $10,000',
        processVolume: 'Very High',
        painPoints: Array(20).fill('manual'), // Try to exceed max
        industry: 'Real Estate'
      };

      const result = transformProcessData(responses);
      expect(result.timeSpent).toBe(45); // Max time
      expect(result.processVolume).toBe(1000); // Max volume
      expect(result.manualProcessCount).toBe(10); // Should be capped at 10
      expect(result.errorRate).toBeGreaterThan(0);
      expect(result.errorRate).toBeLessThan(1);
    });

    it('provides defaults for missing values', () => {
      const responses: Partial<AssessmentResponses> = {
        industry: 'Technology'
      };

      const result = transformProcessData(responses as AssessmentResponses);
      expect(result.timeSpent).toBe(15); // Default medium time
      expect(result.processVolume).toBe(250); // Default medium volume
      expect(result.manualProcessCount).toBe(1); // Minimum count
      expect(result.industry).toBe('Technology');
    });
  });

  describe('calculateProcessMetrics', () => {
    it('calculates metrics for typical input', () => {
      const metrics: ProcessMetrics = {
        timeSpent: 15,
        errorRate: 0.05,
        processVolume: 250,
        manualProcessCount: 2,
        industry: 'Technology'
      };

      const result = calculateProcessMetrics(metrics);
      expect(result.savings.annual).toBeGreaterThan(0);
      expect(result.metrics.efficiency).toBeGreaterThan(0);
      expect(result.metrics.efficiency).toBeLessThanOrEqual(1);
      expect(result.costs.current).toBeGreaterThan(0);
      expect(result.costs.projected).toBeLessThan(result.costs.current);
    });

    it('handles zero-based input gracefully', () => {
      const metrics: ProcessMetrics = {
        timeSpent: 0,
        errorRate: 0,
        processVolume: 0,
        manualProcessCount: 0,
        industry: 'Technology'
      };

      const result = calculateProcessMetrics(metrics);
      expect(result.savings.annual).toBe(0);
      expect(result.metrics.efficiency).toBe(0);
      expect(result.costs.current).toBe(0);
      expect(result.costs.projected).toBe(0);
    });

    it('handles maximum values without exploding', () => {
      const metrics: ProcessMetrics = {
        timeSpent: 100,
        errorRate: 1,
        processVolume: 10000,
        manualProcessCount: 50,
        industry: 'Technology'
      };

      const result = calculateProcessMetrics(metrics);
      expect(result.savings.annual).toBeGreaterThan(0);
      expect(result.metrics.efficiency).toBeLessThanOrEqual(1);
      expect(result.costs.current).toBeGreaterThan(0);
      expect(result.costs.projected).toBeLessThan(result.costs.current);
    });

    it('handles unknown industry gracefully', () => {
      const metrics: ProcessMetrics = {
        timeSpent: 15,
        errorRate: 0.05,
        processVolume: 250,
        manualProcessCount: 2,
        industry: 'UnknownIndustry' as any
      };

      const result = calculateProcessMetrics(metrics);
      expect(result.savings.annual).toBeGreaterThan(0);
      expect(result.metrics.efficiency).toBeGreaterThan(0);
    });
  });
});
