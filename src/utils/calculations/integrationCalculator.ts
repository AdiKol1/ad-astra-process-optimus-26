import { INDUSTRY_STANDARDS } from './constants/industryStandards';
import { calculateMarketingMetrics } from '../marketing/calculators';
import { 
  calculateLaborCosts,
  calculateOperationalCosts,
  calculateErrorCosts,
  calculateOverheadCosts 
} from './utils/costCalculators';
import type { 
  CalculationResults,
  TimeAndCostMetrics,
  ProcessComplexity,
  AutomationResults
} from './types/calculationTypes';

export const calculateIntegratedMetrics = (responses: Record<string, any>): CalculationResults => {
  console.log('Calculating integrated metrics with responses:', responses);

  const automationResults = calculateEnhancedAutomationPotential(responses);
  const marketingMetrics = calculateMarketingMetrics(responses);
  
  // Calculate business impact multiplier
  const businessImpactMultiplier = calculateBusinessImpactMultiplier(responses);
  
  // Enhanced integration of marketing and automation metrics
  const integrated = integrateResults(automationResults, marketingMetrics, businessImpactMultiplier);
  
  return enhanceResultsWithROIAnalysis(integrated, responses);
};

const calculateEnhancedAutomationPotential = (input: Record<string, any>): AutomationResults => {
  const standards = INDUSTRY_STANDARDS[input.industry] || INDUSTRY_STANDARDS.Other;
  
  // Parse input values
  const employees = Number(input.employees) || 1;
  const timeSpent = Number(input.timeSpent) || 20;
  const hourlyRate = 25 * standards.processingTimeMultiplier;

  // Calculate metrics
  const timeAndCostMetrics = {
    currentCosts: {
      labor: calculateLaborCosts(employees, timeSpent, hourlyRate),
      operational: calculateOperationalCosts(input.processVolume, standards),
      error: calculateErrorCosts(input.processVolume, input.errorRate, standards),
      overhead: calculateOverheadCosts(employees, standards)
    },
    timeMetrics: {
      totalHours: timeSpent * 52,
      automatedHours: Math.round(timeSpent * standards.automationPotential * 52),
      savingsPercentage: standards.automationPotential * 100
    }
  };

  const savings = {
    monthly: Math.round(
      (timeAndCostMetrics.currentCosts.labor + 
       timeAndCostMetrics.currentCosts.operational) * 
      standards.automationPotential * 
      standards.savingsMultiplier / 12
    ),
    annual: Math.round(
      (timeAndCostMetrics.currentCosts.labor + 
       timeAndCostMetrics.currentCosts.operational) * 
      standards.automationPotential * 
      standards.savingsMultiplier
    ),
    projected: [0, 0, 0], // Placeholder for projected savings over time
    roiTimeline: 12 // Default ROI timeline in months
  };

  return {
    timeAndCostMetrics,
    savings,
    feasibility: standards.automationPotential * 100,
    implementation: {
      estimatedDuration: 3, // Default 3 months
      costs: {
        setup: 5000,
        training: 2000,
        maintenance: 1000
      },
      risks: ['Implementation complexity', 'Training requirements'],
      readinessScore: 75
    }
  };
};

const calculateBusinessImpactMultiplier = (responses: Record<string, any>): number => {
  const standards = INDUSTRY_STANDARDS[responses.industry] || INDUSTRY_STANDARDS.Other;
  return standards.savingsMultiplier;
};

const integrateResults = (
  automation: AutomationResults,
  marketing: any,
  businessImpact: number
): CalculationResults => {
  return {
    efficiency: {
      timeReduction: Math.round(automation.timeAndCostMetrics.timeMetrics.automatedHours),
      errorReduction: 85, // Default error reduction percentage
      productivity: Math.round(automation.feasibility)
    },
    savings: automation.savings,
    costs: {
      current: Object.values(automation.timeAndCostMetrics.currentCosts)
        .reduce((sum, cost) => sum + cost, 0),
      projected: Object.values(automation.timeAndCostMetrics.currentCosts)
        .reduce((sum, cost) => sum + cost * 0.4, 0) // Assume 60% cost reduction
    }
  };
};

const enhanceResultsWithROIAnalysis = (
  results: CalculationResults,
  responses: Record<string, any>
): CalculationResults => {
  return {
    ...results,
    analysis: {
      riskAdjustedROI: results.savings.annual / (results.costs.current - results.costs.projected),
      paybackPeriod: 12, // Default 12 months
      sensitivityAnalysis: null,
      implementationRoadmap: null
    }
  };
};