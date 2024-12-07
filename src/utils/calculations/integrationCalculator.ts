import { calculateMarketingMetrics } from './marketingCalculator';
import { calculateAutomationPotential } from './automationCalculator';
import { CalculationResults } from '../types';

export const calculateIntegratedMetrics = (responses: Record<string, any>): CalculationResults => {
  console.log('Calculating integrated metrics with responses:', responses);

  // Calculate automation metrics
  const automationResults = calculateAutomationPotential({
    employees: responses.employees,
    timeSpent: responses.timeSpent,
    processVolume: responses.processVolume,
    errorRate: responses.errorRate,
    industry: responses.industry
  });

  // Calculate marketing metrics
  const marketingMetrics = calculateMarketingMetrics(responses);
  console.log('Marketing metrics calculated:', marketingMetrics);

  // Integrate results with marketing impact
  const marketingEfficiencyMultiplier = (marketingMetrics.efficiency / 100) * 0.2;
  const integrated = {
    ...automationResults,
    marketing: marketingMetrics,
    efficiency: {
      ...automationResults.efficiency,
      marketingEfficiency: marketingMetrics.efficiency,
      // Adjust overall efficiency based on marketing metrics
      overall: Math.round(
        automationResults.efficiency.productivity * (1 + marketingEfficiencyMultiplier)
      )
    },
    // Adjust savings based on marketing efficiency
    savings: {
      monthly: Math.round(automationResults.savings.monthly * (1 + marketingEfficiencyMultiplier)),
      annual: Math.round(automationResults.savings.annual * (1 + marketingEfficiencyMultiplier))
    }
  };

  console.log('Final integrated calculation results:', integrated);
  return integrated;
};