export const INDUSTRY_STANDARDS = {
  'Healthcare': {
    baseErrorRate: 0.08,
    automationPotential: 0.65,
    processingTimeMultiplier: 1.3,
    costPerError: 75,
    savingsMultiplier: 1.2
  },
  'Financial Services': {
    baseErrorRate: 0.05,
    automationPotential: 0.75,
    processingTimeMultiplier: 1.2,
    costPerError: 100,
    savingsMultiplier: 1.3
  },
  'Technology': {
    baseErrorRate: 0.03,
    automationPotential: 0.8,
    processingTimeMultiplier: 1.0,
    costPerError: 50,
    savingsMultiplier: 1.3
  },
  'Manufacturing': {
    baseErrorRate: 0.06,
    automationPotential: 0.7,
    processingTimeMultiplier: 1.15,
    costPerError: 85,
    savingsMultiplier: 1.25
  },
  'Professional Services': {
    baseErrorRate: 0.04,
    automationPotential: 0.6,
    processingTimeMultiplier: 1.1,
    costPerError: 60,
    savingsMultiplier: 1.2
  },
  'Legal': {
    baseErrorRate: 0.02,
    automationPotential: 0.55,
    processingTimeMultiplier: 1.4,
    costPerError: 150,
    savingsMultiplier: 1.15
  },
  'Other': {
    baseErrorRate: 0.05,
    automationPotential: 0.6,
    processingTimeMultiplier: 1.0,
    costPerError: 50,
    savingsMultiplier: 1.0
  }
} as const;