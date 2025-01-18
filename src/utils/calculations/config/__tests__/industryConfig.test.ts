import { describe, it, expect } from 'vitest';
import { industryConfig } from '../industryConfig';

describe('Industry Configuration', () => {
  it('has all required industries', () => {
    const requiredIndustries = [
      'technology',
      'healthcare',
      'finance',
      'manufacturing',
      'retail'
    ];

    requiredIndustries.forEach(industry => {
      expect(industryConfig).toHaveProperty(industry);
    });
  });

  it('has valid multipliers for each industry', () => {
    Object.values(industryConfig).forEach(config => {
      expect(config.costMultiplier).toBeGreaterThan(0);
      expect(config.timeMultiplier).toBeGreaterThan(0);
      expect(config.complexityFactor).toBeGreaterThan(0);
    });
  });

  it('has unique multipliers per industry', () => {
    const costMultipliers = new Set(
      Object.values(industryConfig).map(c => c.costMultiplier)
    );
    const timeMultipliers = new Set(
      Object.values(industryConfig).map(c => c.timeMultiplier)
    );

    expect(costMultipliers.size).toBeGreaterThan(1);
    expect(timeMultipliers.size).toBeGreaterThan(1);
  });

  it('has valid ranges for multipliers', () => {
    Object.values(industryConfig).forEach(config => {
      expect(config.costMultiplier).toBeLessThanOrEqual(10);
      expect(config.timeMultiplier).toBeLessThanOrEqual(10);
      expect(config.complexityFactor).toBeLessThanOrEqual(5);
    });
  });

  it('includes industry-specific process types', () => {
    Object.values(industryConfig).forEach(config => {
      expect(Array.isArray(config.processTypes)).toBe(true);
      expect(config.processTypes.length).toBeGreaterThan(0);
    });
  });

  it('has valid complexity ranges', () => {
    Object.values(industryConfig).forEach(config => {
      expect(config.complexityRanges).toBeDefined();
      expect(config.complexityRanges.low).toBeDefined();
      expect(config.complexityRanges.medium).toBeDefined();
      expect(config.complexityRanges.high).toBeDefined();
    });
  });
});
