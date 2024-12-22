import { getVolumeMultiplier, getErrorCosts, getOperationalCosts } from '../industry/volumeCalculator';
import { INDUSTRY_STANDARDS } from '../industry/industryStandards';

describe('volumeCalculator', () => {
  describe('getVolumeMultiplier', () => {
    it('returns correct multiplier for different volume ranges', () => {
      expect(getVolumeMultiplier("Less than 100")).toBe(0.8);
      expect(getVolumeMultiplier("100-500")).toBe(1);
      expect(getVolumeMultiplier("501-1000")).toBe(1.2);
      expect(getVolumeMultiplier("1001-5000")).toBe(1.4);
      expect(getVolumeMultiplier("More than 5000")).toBe(1.6);
    });

    it('returns default multiplier for invalid input', () => {
      expect(getVolumeMultiplier("Invalid Range")).toBe(1);
    });
  });

  describe('getErrorCosts', () => {
    it('calculates error costs correctly', () => {
      const result = getErrorCosts("100-500", "3-5%", 100);
      // 250 (volume) * 0.04 (rate) * 100 (cost) * 12 (months)
      expect(result).toBe(12000);
    });

    it('handles invalid inputs gracefully', () => {
      const result = getErrorCosts("Invalid", "Invalid", 100);
      expect(typeof result).toBe('number');
      expect(result).toBeGreaterThanOrEqual(0);
    });
  });

  describe('getOperationalCosts', () => {
    it('calculates operational costs with industry multiplier', () => {
      const result = getOperationalCosts("100-500", "Technology");
      const expected = 1500 * (INDUSTRY_STANDARDS.Technology?.processingTimeMultiplier || 1);
      expect(result).toBe(expected);
    });

    it('uses default values for unknown industry', () => {
      const result = getOperationalCosts("100-500", "Unknown");
      const expected = 1500 * (INDUSTRY_STANDARDS.Other?.processingTimeMultiplier || 1);
      expect(result).toBe(expected);
    });
  });
});