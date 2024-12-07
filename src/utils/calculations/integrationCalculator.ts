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

  // Integrate results
  const integrated = {
    ...automationResults,
    marketing: marketingMetrics,
    efficiency: {
      ...automationResults.efficiency,
      marketingEfficiency: marketingMetrics.efficiency
    }
  };

  console.log('Integrated calculation results:', integrated);
  return integrated;
};