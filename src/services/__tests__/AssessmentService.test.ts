import { describe, it, expect } from 'vitest';
import { AssessmentService } from '../AssessmentService';

const assessmentService = new AssessmentService();

describe('AssessmentService', () => {
  const mockRawData = {
    responses: {
      manualProcesses: ['Invoice Processing', 'Data Entry'],
      teamSize: 10,
      industry: 'Technology',
      marketingSpend: 10000,
      customerVolume: 500,
      toolStack: ['CRM', 'ERP'],
      currentTech: ['CRM'],
      integrationNeeds: ['API'],
      techChallenges: ['Legacy systems'],
      teamStructure: 'Flat',
      teamSkills: ['Excel', 'Python'],
      trainingNeeds: ['Automation'],
      processVolume: '100-500',
      errorRate: '3-5%',
      automationLevel: 'Moderate',
      challenges: ['Manual entry'],
      objectives: ['Increase efficiency'],
      timeline: 'Q4',
      budget: '50000',
    },
    metadata: {
      startedAt: new Date().toISOString(),
      currentStep: 1,
      totalSteps: 5
    }
  };

  describe('calculateMetrics', () => {
    it('returns computed metrics with expected structure', () => {
      const results = assessmentService.generateResults(mockRawData.responses);
      expect(results).toHaveProperty('metrics');
      expect(results).toHaveProperty('recommendations');
      expect(results).toHaveProperty('summary');
      expect(results.metrics).toHaveProperty('cost');
      expect(results.metrics).toHaveProperty('efficiency');
      expect(results.metrics).toHaveProperty('roi');
      expect(results.metrics.cost).toHaveProperty('paybackPeriod');
      expect(results.metrics.efficiency).toHaveProperty('current');
      expect(results.metrics.efficiency).toHaveProperty('potential');
      expect(results.metrics.efficiency).toHaveProperty('improvement');
      expect(results.metrics.efficiency).toHaveProperty('automationScore');
    });
  });

  describe('generateReport', () => {
    it('generates report with recommendations', () => {
      const results = assessmentService.generateResults(mockRawData.responses);
      const report = results.recommendations;
      expect(report).toHaveProperty('automationOpportunities');
      expect(report).toHaveProperty('processImprovements');
      expect(report).toHaveProperty('toolRecommendations');
      expect(Array.isArray(report.automationOpportunities)).toBe(true);
      expect(Array.isArray(report.processImprovements)).toBe(true);
      expect(Array.isArray(report.toolRecommendations)).toBe(true);
    });

    it('includes valid summary and metrics', () => {
      const results = assessmentService.generateResults(mockRawData.responses);
      const summary = results.summary;
      const metrics = results.metrics;
      expect(summary).toHaveProperty('overview');
      expect(summary).toHaveProperty('keyFindings');
      expect(summary).toHaveProperty('nextSteps');
      expect(metrics.efficiency.current).toBeGreaterThanOrEqual(0);
      expect(metrics.efficiency.potential).toBeLessThanOrEqual(1);
    });
  });
});