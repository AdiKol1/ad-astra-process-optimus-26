import { describe, it, expect, vi } from 'vitest';
import { calculateProcessScore } from '../processScore';
import { calculateIndustryImpact } from '../industryImpact';
import { calculateEfficiencyGains } from '../efficiencyGains';
import { industryConfig } from '../config/industryConfig';
import { telemetry } from '@/utils/monitoring/telemetry';

vi.mock('@/utils/monitoring/telemetry');

describe('Calculation Utils', () => {
  describe('calculateProcessScore', () => {
    it('calculates basic process score correctly', () => {
      const processData = {
        complexity: 'high',
        frequency: 'daily',
        duration: 120, // minutes
        manualSteps: 10
      };

      const score = calculateProcessScore(processData);
      expect(score).toBeGreaterThan(0);
      expect(score).toBeLessThanOrEqual(100);
    });

    it('handles edge cases in process score calculation', () => {
      const edgeCase = {
        complexity: 'low',
        frequency: 'yearly',
        duration: 1,
        manualSteps: 1
      };

      const score = calculateProcessScore(edgeCase);
      expect(score).toBeGreaterThan(0);
      expect(telemetry.trackEvent).toHaveBeenCalledWith(
        'process_score_calculated',
        expect.any(Object)
      );
    });
  });

  describe('calculateIndustryImpact', () => {
    it('calculates industry impact based on config', () => {
      const industry = 'technology';
      const processScore = 75;

      const impact = calculateIndustryImpact(industry, processScore);
      expect(impact).toBeGreaterThan(0);
      expect(impact.costSavings).toBeDefined();
      expect(impact.timeReduction).toBeDefined();
    });

    it('applies industry-specific multipliers', () => {
      const industries = Object.keys(industryConfig);
      const processScore = 50;

      const impacts = industries.map(industry => 
        calculateIndustryImpact(industry, processScore)
      );

      // Verify different industries have different impacts
      const uniqueImpacts = new Set(impacts.map(i => i.costSavings));
      expect(uniqueImpacts.size).toBeGreaterThan(1);
    });
  });

  describe('calculateEfficiencyGains', () => {
    it('calculates efficiency gains correctly', () => {
      const baseMetrics = {
        currentTime: 100,
        currentCost: 1000,
        processScore: 75,
        industry: 'technology'
      };

      const gains = calculateEfficiencyGains(baseMetrics);
      expect(gains.timeReduction).toBeGreaterThan(0);
      expect(gains.costSavings).toBeGreaterThan(0);
    });

    it('handles zero values gracefully', () => {
      const zeroMetrics = {
        currentTime: 0,
        currentCost: 0,
        processScore: 50,
        industry: 'healthcare'
      };

      const gains = calculateEfficiencyGains(zeroMetrics);
      expect(gains.timeReduction).toBe(0);
      expect(gains.costSavings).toBe(0);
    });

    it('tracks calculation events', () => {
      const metrics = {
        currentTime: 100,
        currentCost: 1000,
        processScore: 75,
        industry: 'technology'
      };

      calculateEfficiencyGains(metrics);
      expect(telemetry.trackEvent).toHaveBeenCalledWith(
        'efficiency_calculated',
        expect.any(Object)
      );
    });
  });
});
