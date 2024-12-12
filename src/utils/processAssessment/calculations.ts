import { INDUSTRY_CONFIGS, IndustryType } from '@/types/industryConfig';

export interface ProcessMetrics {
  timeSpent: number;
  errorRate: number;
  processVolume: number;
  manualProcessCount: number;
  industry: IndustryType;
  implementationCost?: string;
}

export interface ProcessResults {
  costs: {
    current: number;
    projected: number;
    breakdown: {
      labor: number;
      errors: number;
      overhead: number;
    };
  };
  savings: {
    monthly: number;
    annual: number;
    breakdown: {
      labor: number;
      errors: number;
      overhead: number;
    };
  };
  metrics: {
    efficiency: number;
    errorReduction: number;
    roi: number;
    paybackPeriodMonths: number;
  };
}

export function calculateProcessMetrics(metrics: ProcessMetrics): ProcessResults {
  const {
    timeSpent,
    errorRate,
    processVolume,
    manualProcessCount,
    industry,
    implementationCost
  } = metrics;

  // Get industry configuration
  const config = INDUSTRY_CONFIGS[industry];
  
  // Calculate base metrics
  const annualHours = timeSpent * 52; // Convert weekly hours to annual
  const volumeScalingFactor = Math.pow(processVolume, config.scalingFactor - 1);
  const processComplexityFactor = Math.log2(manualProcessCount + 1) / 2;

  // Calculate current costs
  const baseLaborCost = annualHours * config.hourlyRate * manualProcessCount;
  const scaledLaborCost = baseLaborCost * volumeScalingFactor;
  const errorCost = scaledLaborCost * errorRate * config.errorCostMultiplier;
  const overheadCost = scaledLaborCost * 0.2; // 20% overhead

  const currentCosts = {
    labor: Math.round(scaledLaborCost),
    errors: Math.round(errorCost),
    overhead: Math.round(overheadCost)
  };

  // Calculate automation impact
  const automationEfficiency = config.automationPotential * (1 - processComplexityFactor);
  const errorReduction = Math.min(0.9, config.automationPotential + 0.1);

  // Calculate projected costs
  const projectedLaborCost = scaledLaborCost * (1 - automationEfficiency);
  const projectedErrorCost = errorCost * (1 - errorReduction);
  const projectedOverheadCost = overheadCost * 0.7; // 30% reduction in overhead

  const projectedCosts = {
    labor: Math.round(projectedLaborCost),
    errors: Math.round(projectedErrorCost),
    overhead: Math.round(projectedOverheadCost)
  };

  // Calculate savings
  const savingsBreakdown = {
    labor: currentCosts.labor - projectedCosts.labor,
    errors: currentCosts.errors - projectedCosts.errors,
    overhead: currentCosts.overhead - projectedOverheadCost
  };

  const totalAnnualSavings = Object.values(savingsBreakdown).reduce((a, b) => a + b, 0);
  const totalMonthlySavings = Math.round(totalAnnualSavings / 12);

  // Calculate ROI and payback period
  const actualImplementationCost = implementationCost 
    ? parseInt(implementationCost) 
    : config.implementationCostBase * processComplexityFactor;
    
  const roi = totalAnnualSavings / actualImplementationCost;
  const paybackPeriodMonths = Math.ceil((actualImplementationCost / totalAnnualSavings) * 12);

  return {
    costs: {
      current: Object.values(currentCosts).reduce((a, b) => a + b, 0),
      projected: Object.values(projectedCosts).reduce((a, b) => a + b, 0),
      breakdown: currentCosts
    },
    savings: {
      monthly: totalMonthlySavings,
      annual: totalAnnualSavings,
      breakdown: savingsBreakdown
    },
    metrics: {
      efficiency: automationEfficiency,
      errorReduction,
      roi,
      paybackPeriodMonths
    }
  };
}
