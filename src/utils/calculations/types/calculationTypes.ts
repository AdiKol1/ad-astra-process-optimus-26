export interface IndustryStandard {
  baseErrorRate: number;
  automationPotential: number;
  processingTimeMultiplier: number;
  costPerError: number;
  savingsMultiplier: number;
  regulatoryComplexity: number;
  dataSecurityRequirement: number;
}

export interface ProcessComplexity {
  score: number;
  automationFeasibility: number;
  implementationDifficulty: number;
}

export interface TimeAndCostMetrics {
  currentCosts: {
    labor: number;
    operational: number;
    error: number;
    overhead: number;
  };
  timeMetrics: {
    totalHours: number;
    automatedHours: number;
    savingsPercentage: number;
  };
}

export interface SavingsProjection {
  monthly: number;
  annual: number;
  projected: number[];
  roiTimeline: number;
}

export interface ImplementationMetrics {
  estimatedDuration: number;
  costs: {
    setup: number;
    training: number;
    maintenance: number;
  };
  risks: string[];
  readinessScore: number;
}

export interface AutomationResults {
  timeAndCostMetrics: TimeAndCostMetrics;
  savings: SavingsProjection;
  feasibility: number;
  implementation: ImplementationMetrics;
}

export interface IntegratedResults {
  efficiency: {
    overall: number;
    byDepartment: Record<string, number>;
  };
  savings: SavingsProjection;
  roi: {
    value: number;
    timeline: number;
  };
  recommendations: string[];
}

export interface CalculationResults {
  efficiency: {
    timeReduction: number;
    errorReduction: number;
    productivity: number;
  };
  savings: {
    monthly: number;
    annual: number;
  };
  costs: {
    current: number;
    projected: number;
  };
  analysis?: {
    riskAdjustedROI: number;
    paybackPeriod: number;
    sensitivityAnalysis: any;
    implementationRoadmap: any;
  };
}