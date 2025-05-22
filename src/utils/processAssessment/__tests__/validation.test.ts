import { describe, expect, it } from 'vitest';
import { validateProcessAssessment, isValidProcessAssessment } from '../validation';
import type { ProcessAssessmentResponse } from '@/types/processAssessment';

describe('Process Assessment Validation', () => {
  const validAssessment: ProcessAssessmentResponse = {
    timeSpent: ['1-2 hours', '2-4 hours'],
    errorRate: ['1-2%', '2-5%'],
    processVolume: '100-500',
    industry: 'Healthcare'
  };

  describe('validateProcessAssessment', () => {
    it('should return empty array for valid assessment', () => {
      const errors = validateProcessAssessment(validAssessment);
      expect(errors).toHaveLength(0);
    });

    it('should validate time spent data', () => {
      const invalidAssessment = {
        ...validAssessment,
        timeSpent: ['Invalid time']
      };
      const errors = validateProcessAssessment(invalidAssessment);
      expect(errors).toContain('Invalid time range: Invalid time');
    });

    it('should validate error rate data', () => {
      const invalidAssessment = {
        ...validAssessment,
        errorRate: ['Invalid rate']
      };
      const errors = validateProcessAssessment(invalidAssessment);
      expect(errors).toContain('Invalid error rate: Invalid rate');
    });

    it('should validate process volume', () => {
      const invalidAssessment = {
        ...validAssessment,
        processVolume: 'Invalid volume'
      };
      const errors = validateProcessAssessment(invalidAssessment);
      expect(errors).toContain('Invalid process volume: Invalid volume');
    });

    it('should validate required fields', () => {
      const invalidAssessment = {
        ...validAssessment,
        industry: ''
      };
      const errors = validateProcessAssessment(invalidAssessment);
      expect(errors).toContain('Industry is required');
    });
  });

  describe('isValidProcessAssessment', () => {
    it('should return true for valid assessment', () => {
      expect(isValidProcessAssessment(validAssessment)).toBe(true);
    });

    it('should return false for invalid assessment', () => {
      const invalidAssessment = {
        ...validAssessment,
        timeSpent: ['Invalid time']
      };
      expect(isValidProcessAssessment(invalidAssessment)).toBe(false);
    });
  });
}); 