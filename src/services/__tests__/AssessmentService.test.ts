import { describe, it, expect } from 'vitest';
import { AssessmentService } from '../AssessmentService';
import { Industry, ProcessVolume, ErrorRate } from '../../types/assessment';

describe('AssessmentService', () => {
  const service = new AssessmentService();

  const mockResponses = {
    teamSize: 10,
    processVolume: ProcessVolume.Medium,
    errorRate: ErrorRate.Medium,
    industry: Industry.Technology,
    manualProcesses: ['data entry', 'report generation'],
    currentTools: ['workflow'],
  };

  describe('generateResults', () => {
    it('returns results with expected structure', () => {
      const result = service.generateResults(mockResponses);

      expect(result).toHaveProperty('metrics');
      expect(result).toHaveProperty('recommendations');
      expect(result).toHaveProperty('summary');

      expect(result.metrics).toHaveProperty('efficiency');
      expect(result.metrics).toHaveProperty('cost');
      expect(result.metrics).toHaveProperty('roi');
    });

    it('returns valid efficiency metrics', () => {
      const result = service.generateResults(mockResponses);

      expect(result.metrics.efficiency.current).toBeGreaterThanOrEqual(0);
      expect(result.metrics.efficiency.current).toBeLessThanOrEqual(1);
      expect(result.metrics.efficiency.potential).toBeGreaterThanOrEqual(
        result.metrics.efficiency.current
      );
    });

    it('returns valid cost metrics', () => {
      const result = service.generateResults(mockResponses);

      expect(result.metrics.cost.current).toBeGreaterThan(0);
      expect(result.metrics.cost.projected).toBeLessThanOrEqual(result.metrics.cost.current);
      expect(result.metrics.cost.savings).toBeGreaterThanOrEqual(0);
    });

    it('generates recommendations', () => {
      const result = service.generateResults(mockResponses);

      expect(result.recommendations).toHaveProperty('automationOpportunities');
      expect(result.recommendations).toHaveProperty('processImprovements');
      expect(result.recommendations).toHaveProperty('toolRecommendations');
    });

    it('generates summary with overview and next steps', () => {
      const result = service.generateResults(mockResponses);

      expect(result.summary.overview).toBeTruthy();
      expect(result.summary.keyFindings.length).toBeGreaterThan(0);
      expect(result.summary.nextSteps.length).toBeGreaterThan(0);
    });
  });
});
