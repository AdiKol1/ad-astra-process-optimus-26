import { assessmentService } from '../AssessmentService';

describe('AssessmentService', () => {
  const mockRawData = {
    responses: {
      teamSize: 10,
      processVolume: "100-500",
      errorRate: "3-5%",
      industry: "Technology"
    },
    metadata: {
      startedAt: new Date().toISOString(),
      currentStep: 1,
      totalSteps: 5
    }
  };

  describe('calculateMetrics', () => {
    it('returns computed metrics with expected structure', () => {
      const result = assessmentService.calculateMetrics(mockRawData);
      
      expect(result).toHaveProperty('cac');
      expect(result).toHaveProperty('automation');
      expect(result).toHaveProperty('efficiency');
      
      expect(result.cac.potentialReduction).toBeGreaterThanOrEqual(0);
      expect(result.cac.potentialReduction).toBeLessThanOrEqual(100);
      
      expect(result.automation.productivity).toBeGreaterThanOrEqual(0);
      expect(result.automation.productivity).toBeLessThanOrEqual(100);
    });
  });

  describe('generateReport', () => {
    it('generates report with recommendations', () => {
      const metrics = assessmentService.calculateMetrics(mockRawData);
      const report = assessmentService.generateReport(metrics);
      
      expect(report).toHaveProperty('scores');
      expect(report).toHaveProperty('recommendations');
      expect(report).toHaveProperty('projections');
      
      expect(Array.isArray(report.recommendations)).toBe(true);
      expect(report.recommendations.length).toBeGreaterThan(0);
    });

    it('includes valid score percentages', () => {
      const metrics = assessmentService.calculateMetrics(mockRawData);
      const report = assessmentService.generateReport(metrics);
      
      expect(report.scores.overall).toBeGreaterThanOrEqual(0);
      expect(report.scores.overall).toBeLessThanOrEqual(100);
      
      Object.values(report.scores.sections).forEach(section => {
        expect(section.percentage).toBeGreaterThanOrEqual(0);
        expect(section.percentage).toBeLessThanOrEqual(100);
      });
    });
  });
});