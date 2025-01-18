import { AssessmentResponses } from '@/types/assessment';
import { logger } from '@/utils/logger';

interface CalculationResult {
  savings: {
    annual: number;
    monthly: number;
  };
  metrics: {
    efficiency: number;
    roi: number;
    automationLevel: number;
    paybackPeriodMonths: number;
  };
  costs: {
    current: number;
    projected: number;
    breakdown: {
      labor: { current: number; projected: number };
      tools: { current: number; projected: number };
      overhead: { current: number; projected: number };
    };
  };
  recommendations: Array<{
    title: string;
    description: string;
    impact: string;
  }>;
}

// Constants for calculations
const HOURLY_RATE = 50; // Average hourly rate
const WORK_HOURS_PER_YEAR = 2080; // 40 hours/week * 52 weeks
const AUTOMATION_COST_FACTOR = 0.4; // 40% of current costs
const EFFICIENCY_IMPROVEMENT_FACTOR = 0.6; // 60% improvement in efficiency

export const calculateResults = async (
  responses: AssessmentResponses
): Promise<CalculationResult> => {
  try {
    logger.info('Starting results calculation', { responses });

    // Validate required fields
    const requiredFields = ['timeSpent', 'processVolume', 'errorRate', 'complexity'];
    const missingFields = requiredFields.filter(field => !responses[field]);
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    // Extract and validate key metrics
    const hoursPerWeek = Number(responses.timeSpent);
    const processVolume = Number(responses.processVolume);
    const errorRate = Number(responses.errorRate);
    const complexityLevel = Number(responses.complexity);

    // Validate numeric values
    if (isNaN(hoursPerWeek) || isNaN(processVolume) || isNaN(errorRate) || isNaN(complexityLevel)) {
      throw new Error('Invalid numeric values in responses');
    }

    // Validate ranges
    if (hoursPerWeek <= 0 || hoursPerWeek > 168) { // 168 hours in a week
      throw new Error('Invalid hours per week value');
    }
    if (errorRate < 0 || errorRate > 100) {
      throw new Error('Invalid error rate percentage');
    }
    if (complexityLevel < 1 || complexityLevel > 5) {
      throw new Error('Invalid complexity level');
    }

    // Calculate base metrics
    const annualHours = hoursPerWeek * 52;
    const currentAnnualCost = annualHours * HOURLY_RATE;
    const currentErrorCost = (errorRate / 100) * currentAnnualCost;
    const totalCurrentCost = currentAnnualCost + currentErrorCost;

    // Calculate efficiency metrics
    const automationLevel = calculateAutomationLevel(responses);
    const efficiencyGain = EFFICIENCY_IMPROVEMENT_FACTOR * automationLevel;
    const projectedAnnualCost = currentAnnualCost * (1 - efficiencyGain);
    const projectedErrorCost = currentErrorCost * (1 - efficiencyGain * 1.5); // Extra error reduction from automation

    // Calculate savings
    const annualSavings = totalCurrentCost - (projectedAnnualCost + projectedErrorCost);
    const monthlySavings = annualSavings / 12;

    // Calculate ROI
    const implementationCost = totalCurrentCost * AUTOMATION_COST_FACTOR;
    const roi = (annualSavings / implementationCost) * 100;
    const paybackPeriodMonths = (implementationCost / monthlySavings);

    const result: CalculationResult = {
      savings: {
        annual: Math.round(annualSavings),
        monthly: Math.round(monthlySavings)
      },
      metrics: {
        efficiency: Math.round(efficiencyGain * 100),
        roi: Math.round(roi),
        automationLevel: Math.round(automationLevel * 100),
        paybackPeriodMonths: Math.round(paybackPeriodMonths)
      },
      costs: {
        current: Math.round(totalCurrentCost),
        projected: Math.round(projectedAnnualCost + projectedErrorCost),
        breakdown: {
          labor: {
            current: Math.round(currentAnnualCost),
            projected: Math.round(projectedAnnualCost)
          },
          tools: {
            current: 0,
            projected: Math.round(implementationCost)
          },
          overhead: {
            current: Math.round(currentErrorCost),
            projected: Math.round(projectedErrorCost)
          }
        }
      },
      recommendations: generateRecommendations({
        hoursPerWeek,
        processVolume,
        errorRate,
        complexityLevel,
        efficiencyGain,
        roi
      })
    };

    logger.info('Calculation completed successfully', { result });
    return result;

  } catch (error) {
    logger.error('Failed to calculate results:', error);
    throw error;
  }
};

const calculateAutomationLevel = (responses: AssessmentResponses): number => {
  // Calculate current automation level based on responses
  let automationScore = 0;
  const totalFactors = 4;

  // Factor 1: Process Documentation (0-25)
  automationScore += responses.processDocumentation ? 25 : 0;

  // Factor 2: Digital Tools Usage (0-25)
  automationScore += responses.digitalTools ? 25 : 0;

  // Factor 3: Process Standardization (0-25)
  automationScore += responses.standardization ? 25 : 0;

  // Factor 4: Integration Level (0-25)
  automationScore += responses.integration ? 25 : 0;

  return automationScore / totalFactors;
};

const generateRecommendations = (metrics: {
  hoursPerWeek: number;
  processVolume: number;
  errorRate: number;
  complexityLevel: number;
  efficiencyGain: number;
  roi: number;
}): Array<{ title: string; description: string; impact: string }> => {
  const recommendations: Array<{ title: string; description: string; impact: string }> = [];

  // Time-saving recommendation
  if (metrics.hoursPerWeek >= 10) {
    recommendations.push({
      title: 'Process Automation',
      description: 'Implement automated workflows to reduce manual intervention and save time.',
      impact: `Save ${Math.round(metrics.hoursPerWeek * metrics.efficiencyGain)} hours per week`
    });
  }

  // Error reduction recommendation
  if (metrics.errorRate > 5) {
    recommendations.push({
      title: 'Error Prevention',
      description: 'Implement validation checks and automated quality control measures.',
      impact: `Reduce errors by up to ${Math.round(metrics.errorRate * 0.8)}%`
    });
  }

  // Volume handling recommendation
  if (metrics.processVolume > 100) {
    recommendations.push({
      title: 'Scale Operations',
      description: 'Implement batch processing and parallel execution capabilities.',
      impact: 'Handle 3x more volume without additional resources'
    });
  }

  // Process standardization
  if (metrics.complexityLevel > 2) {
    recommendations.push({
      title: 'Standardize Workflows',
      description: 'Create standardized templates and workflow patterns.',
      impact: 'Reduce process complexity by 40%'
    });
  }

  // If ROI is high, add strategic recommendation
  if (metrics.roi > 200) {
    recommendations.push({
      title: 'Strategic Investment',
      description: 'Consider comprehensive automation platform implementation.',
      impact: `Achieve ${Math.round(metrics.roi)}% ROI within first year`
    });
  }

  return recommendations;
};
