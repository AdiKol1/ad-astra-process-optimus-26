import { calculateAutomationPotential } from '../results/calculationResults';
import { INDUSTRY_STANDARDS } from '../industry/industryStandards';

describe('calculationResults', () => {
  const mockAnswers = {
    employees: 10,
    timeSpent: 20,
    processVolume: "100-500",
    errorRate: "3-5%",
    industry: "Technology"
  };

  describe('calculateAutomationPotential', () => {
    it('returns expected structure', () => {
      const result = calculateAutomationPotential(mockAnswers);
      
      expect(result).toHaveProperty('costs');
      expect(result).toHaveProperty('savings');
      expect(result).toHaveProperty('efficiency');
      
      expect(result.costs).toHaveProperty('current');
      expect(result.costs).toHaveProperty('projected');
      
      expect(result.savings).toHaveProperty('monthly');
      expect(result.savings).toHaveProperty('annual');
      
      expect(result.efficiency).toHaveProperty('timeReduction');
      expect(result.efficiency).toHaveProperty('errorReduction');
      expect(result.efficiency).toHaveProperty('productivity');
    });

    it('calculates values based on industry standards', () => {
      const result = calculateAutomationPotential(mockAnswers);
      const industryStandard = INDUSTRY_STANDARDS[mockAnswers.industry] || INDUSTRY_STANDARDS.Other;
      
      expect(result.efficiency.timeReduction).toBeGreaterThan(0);
      expect(result.savings.annual).toBeGreaterThan(0);
      expect(result.costs.projected).toBeLessThan(result.costs.current);
    });

    it('handles missing data gracefully', () => {
      const result = calculateAutomationPotential({});
      
      expect(result.costs.current).toBeGreaterThanOrEqual(0);
      expect(result.savings.annual).toBeGreaterThanOrEqual(0);
      expect(result.efficiency.productivity).toBeGreaterThanOrEqual(0);
    });
  });
});