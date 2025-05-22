import { calculateProcessMetrics } from '../calculations';
import { INDUSTRY_CONFIGS, IndustryType } from '../../../types/industryConfig';
import { describe, expect, it } from 'vitest';
import {
  calculateProcessScore,
  generateRecommendations,
  calculateProcessAssessment
} from '../calculations';
import type { ProcessAssessmentResponse } from '../../../types/processAssessment';

describe('Process Assessment Calculations', () => {
  const baseAssessment: ProcessAssessmentResponse = {
    timeSpent: ['2-4 hours'],
    errorRate: ['2-5%'],
    processVolume: '501-1000',
    industry: 'Technology'
  };

  const validAssessment: ProcessAssessmentResponse = {
    timeSpent: ['1-2 hours', '2-4 hours'],
    errorRate: ['1-2%', '2-5%'],
    processVolume: '100-500',
    industry: 'Healthcare'
  };

  describe('calculateProcessMetrics', () => {
    it('calculates metrics correctly for Technology industry', () => {
      const result = calculateProcessMetrics(baseAssessment);
      expect(result).toHaveProperty('timeSpent');
      expect(result).toHaveProperty('errorRate');
      expect(result).toHaveProperty('processVolume');
      expect(typeof result.timeSpent).toBe('number');
      expect(typeof result.errorRate).toBe('number');
      expect(typeof result.processVolume).toBe('number');
    });

    it('falls back to Other industry config when unknown industry provided', () => {
      const unknownAssessment: ProcessAssessmentResponse = {
        ...baseAssessment,
        industry: 'Other'
      };
      const result = calculateProcessMetrics(unknownAssessment);
      expect(result).toBeDefined();
      expect(typeof result.timeSpent).toBe('number');
    });

    it('handles extreme values appropriately', () => {
      const extremeAssessment: ProcessAssessmentResponse = {
        timeSpent: ['More than 8 hours'],
        errorRate: ['More than 10%'],
        processVolume: 'More than 5000',
        industry: 'Technology'
      };
      const result = calculateProcessMetrics(extremeAssessment);
      expect(typeof result.timeSpent).toBe('number');
      expect(typeof result.errorRate).toBe('number');
      expect(typeof result.processVolume).toBe('number');
    });

    it('calculates different results for different industries', () => {
      const industries: IndustryType[] = ['Manufacturing', 'Healthcare', 'Financial', 'Technology', 'Retail'];
      const results = industries.map(industry =>
        calculateProcessMetrics({ ...baseAssessment, industry })
      );
      const timeSpents = results.map(r => r.timeSpent);
      const uniqueTimeSpents = new Set(timeSpents);
      expect(uniqueTimeSpents.size).toBeGreaterThan(1);
    });

    it('maintains consistent relationships between metrics', () => {
      const result = calculateProcessMetrics(baseAssessment);
      expect(typeof result.timeSpent).toBe('number');
      expect(typeof result.errorRate).toBe('number');
      expect(typeof result.processVolume).toBe('number');
    });

    it('should calculate metrics correctly', () => {
      const metrics = calculateProcessMetrics(validAssessment);
      expect(metrics.timeSpent).toBeCloseTo(3.15, 2); // Average of 1.5 and 3, then * 1.4
      expect(metrics.errorRate).toBeCloseTo(0.045, 3); // Average of 0.015 and 0.035, then * 1.8
      expect(metrics.processVolume).toBeCloseTo(360, 0); // 300 * 1.2
    });

    it('should throw error for invalid assessment', () => {
      const invalidAssessment = {
        ...validAssessment,
        timeSpent: ['Invalid time']
      };
      expect(() => calculateProcessMetrics(invalidAssessment)).toThrow();
    });
  });

  describe('calculateProcessScore', () => {
    it('should calculate score within 0-100 range', () => {
      const metrics = calculateProcessMetrics(validAssessment);
      const score = calculateProcessScore(metrics);
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);
    });

    it('should give higher score for better metrics', () => {
      const goodMetrics = {
        timeSpent: 1,
        errorRate: 0.01,
        processVolume: 1000
      };
      const badMetrics = {
        timeSpent: 8,
        errorRate: 0.1,
        processVolume: 50
      };
      expect(calculateProcessScore(goodMetrics)).toBeGreaterThan(calculateProcessScore(badMetrics));
    });
  });

  describe('generateRecommendations', () => {
    it('should generate recommendations based on metrics', () => {
      const metrics = {
        timeSpent: 5,
        errorRate: 0.06,
        processVolume: 1500
      };
      const recommendations = generateRecommendations(metrics);
      expect(recommendations).toContain('Consider process automation to reduce manual processing time');
      expect(recommendations).toContain('Implement additional validation checks to reduce error rates');
      expect(recommendations).toContain('Scale up automation to handle high process volume efficiently');
    });

    it('should return empty array for good metrics', () => {
      const metrics = {
        timeSpent: 2,
        errorRate: 0.02,
        processVolume: 500
      };
      const recommendations = generateRecommendations(metrics);
      expect(recommendations).toHaveLength(0);
    });
  });

  describe('calculateProcessAssessment', () => {
    it('should return complete assessment result', () => {
      const result = calculateProcessAssessment(validAssessment);
      expect(result).toHaveProperty('metrics');
      expect(result).toHaveProperty('score');
      expect(result).toHaveProperty('recommendations');
      expect(result.score).toBeGreaterThanOrEqual(0);
      expect(result.score).toBeLessThanOrEqual(100);
      expect(Array.isArray(result.recommendations)).toBe(true);
    });

    it('should throw error for invalid assessment', () => {
      const invalidAssessment = {
        ...validAssessment,
        timeSpent: ['Invalid time']
      };
      expect(() => calculateProcessAssessment(invalidAssessment)).toThrow();
    });
  });
});
