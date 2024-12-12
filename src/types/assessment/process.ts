export interface ProcessMetrics {
  timeSpent: number;
  errorRate: number;
  processVolume: number;
  manualProcessCount: number;
  industry: string;
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

export interface ProcessState {
  metrics: ProcessMetrics | null;
  results: ProcessResults | null;
  loading: boolean;
  error: string | null;
}

export interface ProcessCalculator {
  calculateProcessMetrics: (metrics: ProcessMetrics) => ProcessResults;
  validateMetrics: (metrics: Partial<ProcessMetrics>) => boolean;
}
