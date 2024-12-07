import { calculateMarketingMetrics } from './marketingCalculator';
import { calculateAutomationPotential } from './automationCalculator';
import { CalculationResults } from '../types';

export const calculateIntegratedMetrics = (responses: Record<string, any>): CalculationResults => {
  console.log('Calculating integrated metrics with responses:', responses);

  // Calculate automation metrics
  const automationResults = calculateAutomationPotential({
    employees: responses.teamSize?.[0]?.split(' ')?.[0] || '1',
    timeSpent: responses.timeSpent?.[0]?.split(' ')?.[0] || '20',
    processVolume: responses.processVolume || '100-500',
    errorRate: responses.errorRate?.[0] || '3-5%',
    industry: responses.industry || 'Other'
  });

  // Calculate marketing metrics
  const marketingMetrics = calculateMarketingMetrics(responses);
  console.log('Marketing metrics calculated:', marketingMetrics);

  // Integrate results with marketing impact
  const marketingEfficiencyMultiplier = (marketingMetrics.efficiency / 100) * 0.2;
  
  // Adjust calculations based on marketing efficiency
  const integrated = {
    ...automationResults,
    marketing: marketingMetrics,
    efficiency: {
      ...automationResults.efficiency,
      marketingEfficiency: marketingMetrics.efficiency,
      overall: Math.round(
        automationResults.efficiency.productivity * (1 + marketingEfficiencyMultiplier)
      )
    },
    savings: {
      monthly: Math.round(automationResults.savings.monthly * (1 + marketingEfficiencyMultiplier)),
      annual: Math.round(automationResults.savings.annual * (1 + marketingEfficiencyMultiplier))
    }
  };

  console.log('Final integrated calculation results:', integrated);
  return integrated;
};