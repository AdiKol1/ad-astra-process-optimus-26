export type IndustryType = 'Manufacturing' | 'Healthcare' | 'Financial' | 'Technology' | 'Retail' | 'Other';

export interface IndustryConfig {
  baseCost: number;
  efficiencyMultiplier: number;
  errorRateMultiplier: number;
  volumeMultiplier: number;
}

export const INDUSTRY_CONFIGS: Record<IndustryType, IndustryConfig> = {
  Manufacturing: {
    baseCost: 1000,
    efficiencyMultiplier: 1.2,
    errorRateMultiplier: 1.5,
    volumeMultiplier: 1.3
  },
  Healthcare: {
    baseCost: 1500,
    efficiencyMultiplier: 1.4,
    errorRateMultiplier: 1.8,
    volumeMultiplier: 1.2
  },
  Financial: {
    baseCost: 2000,
    efficiencyMultiplier: 1.3,
    errorRateMultiplier: 1.6,
    volumeMultiplier: 1.4
  },
  Technology: {
    baseCost: 1800,
    efficiencyMultiplier: 1.5,
    errorRateMultiplier: 1.4,
    volumeMultiplier: 1.6
  },
  Retail: {
    baseCost: 800,
    efficiencyMultiplier: 1.1,
    errorRateMultiplier: 1.3,
    volumeMultiplier: 1.1
  },
  Other: {
    baseCost: 1000,
    efficiencyMultiplier: 1.0,
    errorRateMultiplier: 1.0,
    volumeMultiplier: 1.0
  }
};
