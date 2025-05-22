import { describe, expect, it } from 'vitest';
import { TIME_RANGE_MAPPINGS, ERROR_RANGE_MAPPINGS, VOLUME_RANGE_MAPPINGS } from '../mappings';

describe('Process Assessment Mappings', () => {
  describe('TIME_RANGE_MAPPINGS', () => {
    it('should have valid time range values', () => {
      const validValues = [
        'Less than 1 hour',
        '1-2 hours',
        '2-4 hours',
        '4-8 hours',
        'More than 8 hours'
      ];

      TIME_RANGE_MAPPINGS.forEach(mapping => {
        expect(validValues).toContain(mapping.value);
        expect(mapping.numeric).toBeGreaterThanOrEqual(0);
      });
    });

    it('should have ascending numeric values', () => {
      const numericValues = TIME_RANGE_MAPPINGS.map(m => m.numeric);
      const sortedValues = [...numericValues].sort((a, b) => a - b);
      expect(numericValues).toEqual(sortedValues);
    });
  });

  describe('ERROR_RANGE_MAPPINGS', () => {
    it('should have valid error rate values', () => {
      const validValues = [
        'Less than 1%',
        '1-2%',
        '2-5%',
        '5-10%',
        'More than 10%'
      ];

      ERROR_RANGE_MAPPINGS.forEach(mapping => {
        expect(validValues).toContain(mapping.value);
        expect(mapping.numeric).toBeGreaterThanOrEqual(0);
        expect(mapping.numeric).toBeLessThanOrEqual(1);
      });
    });

    it('should have ascending numeric values', () => {
      const numericValues = ERROR_RANGE_MAPPINGS.map(m => m.numeric);
      const sortedValues = [...numericValues].sort((a, b) => a - b);
      expect(numericValues).toEqual(sortedValues);
    });
  });

  describe('VOLUME_RANGE_MAPPINGS', () => {
    it('should have valid volume range values', () => {
      const validValues = [
        'Less than 100',
        '100-500',
        '501-1000',
        '1001-5000',
        'More than 5000'
      ];

      VOLUME_RANGE_MAPPINGS.forEach(mapping => {
        expect(validValues).toContain(mapping.value);
        expect(mapping.numeric).toBeGreaterThanOrEqual(0);
      });
    });

    it('should have ascending numeric values', () => {
      const numericValues = VOLUME_RANGE_MAPPINGS.map(m => m.numeric);
      const sortedValues = [...numericValues].sort((a, b) => a - b);
      expect(numericValues).toEqual(sortedValues);
    });
  });
}); 