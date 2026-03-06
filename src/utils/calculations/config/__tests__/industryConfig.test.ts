import { describe, it, expect } from 'vitest';
import { INDUSTRY_CONFIGS, getIndustryConfig } from '../industryConfig';

describe('Industry Configuration', () => {
  it('has all required industries', () => {
    const requiredIndustries = [
      'Technology',
      'Healthcare',
      'Financial Services',
      'Real Estate',
      'Other'
    ];

    requiredIndustries.forEach(industry => {
      expect(INDUSTRY_CONFIGS).toHaveProperty(industry);
    });
  });

  it('has valid multipliers for each industry', () => {
    Object.values(INDUSTRY_CONFIGS).forEach(config => {
      expect(config.processingTimeMultiplier).toBeGreaterThan(0);
      expect(config.savingsMultiplier).toBeGreaterThan(0);
      expect(config.automationPotential).toBeGreaterThan(0);
    });
  });

  it('has unique multipliers per industry', () => {
    const savingsMultipliers = new Set(
      Object.values(INDUSTRY_CONFIGS).map(c => c.savingsMultiplier)
    );
    const processingMultipliers = new Set(
      Object.values(INDUSTRY_CONFIGS).map(c => c.processingTimeMultiplier)
    );

    expect(savingsMultipliers.size).toBeGreaterThan(1);
    expect(processingMultipliers.size).toBeGreaterThan(1);
  });

  it('has valid ranges for multipliers', () => {
    Object.values(INDUSTRY_CONFIGS).forEach(config => {
      expect(config.processingTimeMultiplier).toBeLessThanOrEqual(10);
      expect(config.savingsMultiplier).toBeLessThanOrEqual(10);
      expect(config.automationPotential).toBeLessThanOrEqual(1);
    });
  });

  it('has valid cost per error values', () => {
    Object.values(INDUSTRY_CONFIGS).forEach(config => {
      expect(config.costPerError).toBeGreaterThan(0);
    });
  });

  it('has valid maxROI values', () => {
    Object.values(INDUSTRY_CONFIGS).forEach(config => {
      expect(config.maxROI).toBeGreaterThan(0);
    });
  });

  it('returns fallback config for unknown industry', () => {
    const config = getIndustryConfig('NonExistent' as any);
    expect(config).toEqual(INDUSTRY_CONFIGS['Other']);
  });
});
