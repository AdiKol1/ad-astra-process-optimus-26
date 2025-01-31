import { INDUSTRY_CONFIGS, IndustryType } from '@/types/industryConfig';
import { describe, it, expect, test, beforeEach, afterEach, beforeAll, afterAll } from 'vitest';

describe('Industry Configuration', () => {
  const industries: IndustryType[] = [
    'Manufacturing',
    'Healthcare',
    'Financial',
    'Technology',
    'Retail',
    'Other'
  ];

  describe('INDUSTRY_CONFIGS', () => {
    it('contains all defined industry types', () => {
      industries.forEach(industry => {
        expect(INDUSTRY_CONFIGS).toHaveProperty(industry);
      });
    });

    it('each industry has required configuration properties', () => {
      const requiredProps = [
        'processingTimeMultiplier',
        'costPerError',
        'automationPotential',
        'savingsMultiplier',
        'complexityFactor'
      ];

      industries.forEach(industry => {
        const config = INDUSTRY_CONFIGS[industry];
        requiredProps.forEach(prop => {
          expect(config).toHaveProperty(prop);
          expect(typeof config[prop]).toBe('number');
        });
      });
    });

    it('multipliers and factors are within reasonable bounds', () => {
      industries.forEach(industry => {
        const config = INDUSTRY_CONFIGS[industry];
        
        // Processing time multiplier should be reasonable
        expect(config.processingTimeMultiplier).toBeGreaterThan(0);
        expect(config.processingTimeMultiplier).toBeLessThan(2);

        // Cost per error should be positive
        expect(config.costPerError).toBeGreaterThan(0);

        // Automation potential should be between 0 and 1
        expect(config.automationPotential).toBeGreaterThan(0);
        expect(config.automationPotential).toBeLessThanOrEqual(1);

        // Savings multiplier should be reasonable
        expect(config.savingsMultiplier).toBeGreaterThan(0);
        expect(config.savingsMultiplier).toBeLessThan(2);

        // Complexity factor should be reasonable
        expect(config.complexityFactor).toBeGreaterThan(0);
        expect(config.complexityFactor).toBeLessThan(2);
      });
    });

    it('Other industry has conservative values', () => {
      const other = INDUSTRY_CONFIGS.Other;
      
      // Other industry should have the most conservative values
      industries.forEach(industry => {
        if (industry !== 'Other') {
          expect(other.automationPotential)
            .toBeLessThanOrEqual(INDUSTRY_CONFIGS[industry].automationPotential);
          expect(other.savingsMultiplier)
            .toBeLessThanOrEqual(INDUSTRY_CONFIGS[industry].savingsMultiplier);
        }
      });
    });

    it('relative relationships between industries are maintained', () => {
      // Financial should have higher cost per error than Retail
      expect(INDUSTRY_CONFIGS.Financial.costPerError)
        .toBeGreaterThan(INDUSTRY_CONFIGS.Retail.costPerError);

      // Technology should have higher automation potential than Manufacturing
      expect(INDUSTRY_CONFIGS.Technology.automationPotential)
        .toBeGreaterThan(INDUSTRY_CONFIGS.Manufacturing.automationPotential);

      // Healthcare should have higher complexity factor than Retail
      expect(INDUSTRY_CONFIGS.Healthcare.complexityFactor)
        .toBeGreaterThan(INDUSTRY_CONFIGS.Retail.complexityFactor);
    });
  });
});
