import { calculateProcessMetrics } from '../calculations';
import { INDUSTRY_CONFIGS, IndustryType } from '@/types/industryConfig';

describe('Process Assessment Calculations', () => {
  const baseMetrics = {
    timeSpent: 40,
    errorRate: 0.05,
    processVolume: 1000,
    manualProcessCount: 3,
    industry: 'Technology' as IndustryType
  };

  describe('calculateProcessMetrics', () => {
    test('calculates metrics correctly for Technology industry', () => {
      const result = calculateProcessMetrics(baseMetrics);

      // Basic structure checks
      expect(result).toHaveProperty('costs');
      expect(result).toHaveProperty('savings');
      expect(result).toHaveProperty('efficiency');
      expect(result).toHaveProperty('roi');

      // Costs should be positive and projected less than current
      expect(result.costs.current).toBeGreaterThan(0);
      expect(result.costs.projected).toBeGreaterThan(0);
      expect(result.costs.projected).toBeLessThan(result.costs.current);

      // Savings should be positive
      expect(result.savings.monthly).toBeGreaterThan(0);
      expect(result.savings.annual).toBeGreaterThan(0);
      expect(result.savings.annual).toBe(result.savings.monthly * 12);

      // Efficiency metrics should be within bounds
      expect(result.efficiency.timeReduction).toBeGreaterThanOrEqual(0);
      expect(result.efficiency.timeReduction).toBeLessThanOrEqual(baseMetrics.timeSpent);
      expect(result.efficiency.errorReduction).toBeGreaterThanOrEqual(0);
      expect(result.efficiency.errorReduction).toBeLessThanOrEqual(100);
      expect(result.efficiency.productivity).toBeGreaterThanOrEqual(0);
      expect(result.efficiency.productivity).toBeLessThanOrEqual(85);

      // ROI should be positive
      expect(result.roi).toBeGreaterThan(0);
    });

    test('falls back to Other industry config when unknown industry provided', () => {
      const unknownIndustryMetrics = {
        ...baseMetrics,
        industry: 'Unknown' as IndustryType
      };
      const result = calculateProcessMetrics(unknownIndustryMetrics);
      
      // Should still calculate without errors
      expect(result).toBeDefined();
      expect(result.costs.current).toBeGreaterThan(0);
    });

    test('handles extreme values appropriately', () => {
      const extremeMetrics = {
        ...baseMetrics,
        timeSpent: 100,
        errorRate: 0.2,
        processVolume: 10000,
        manualProcessCount: 10
      };
      const result = calculateProcessMetrics(extremeMetrics);

      // Even with extreme values, results should be reasonable
      expect(result.efficiency.productivity).toBeLessThanOrEqual(85);
      expect(result.efficiency.errorReduction).toBeLessThanOrEqual(100);
    });

    test('calculates different results for different industries', () => {
      const industries: IndustryType[] = ['Manufacturing', 'Healthcare', 'Financial', 'Technology', 'Retail'];
      const results = industries.map(industry => 
        calculateProcessMetrics({ ...baseMetrics, industry })
      );

      // Each industry should produce different results
      const rois = results.map(r => r.roi);
      const uniqueRois = new Set(rois);
      expect(uniqueRois.size).toBeGreaterThan(1);
    });

    test('maintains consistent relationships between metrics', () => {
      const result = calculateProcessMetrics(baseMetrics);

      // Annual savings should be approximately monthly * 12 (allowing for rounding)
      expect(Math.abs(result.savings.annual - (result.savings.monthly * 12))).toBeLessThan(5);

      // Projected costs should be less than current costs
      expect(result.costs.projected).toBeLessThan(result.costs.current);

      // Savings should be approximately the difference between current and projected costs
      const annualDifference = result.costs.current - result.costs.projected;
      expect(Math.abs(annualDifference - result.savings.annual)).toBeLessThan(5);
    });
  });
});
