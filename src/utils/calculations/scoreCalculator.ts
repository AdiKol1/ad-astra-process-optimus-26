import { calculateCACMetrics } from '../cac/cacMetricsCalculator';
import { calculateAutomationPotential } from './automationCalculator';

export const calculateAssessmentScores = (responses: Record<string, any>) => {
  const automationResults = calculateAutomationPotential(responses);
  const cacMetrics = calculateCACMetrics(responses, responses.industry || 'Other');

  return {
    qualificationScore: Math.round(
      ((automationResults.efficiency.productivity + cacMetrics.efficiency.productivity) / 2) * 100
    ),
    automationPotential: Math.round(automationResults.efficiency.productivity),
    sectionScores: {
      team: { percentage: Math.round(cacMetrics.efficiency.productivity * 100) },
      process: { percentage: Math.round(automationResults.efficiency.productivity) },
      automation: { percentage: Math.round(cacMetrics.efficiency.productivity * 100) }
    },
    results: {
      annual: {
        savings: automationResults.savings.annual,
        hours: automationResults.efficiency.timeReduction * 52
      },
      cac: {
        currentCAC: cacMetrics.currentCAC,
        potentialReduction: Math.round(cacMetrics.potentialReduction),
        annualSavings: cacMetrics.annualSavings,
        automationROI: Math.round(cacMetrics.automationROI * 100)
      }
    }
  };
};