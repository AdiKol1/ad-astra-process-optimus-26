export const DEFAULT_INDUSTRY_STANDARDS = {
  baseErrorRate: 0.05,
  automationPotential: 0.6,
  processingTimeMultiplier: 1.0,
  costPerError: 50,
  savingsMultiplier: 1.0
};

export const getIndustryStandards = (industry: string | undefined) => {
  console.log('Getting industry standards for:', industry);
  return DEFAULT_INDUSTRY_STANDARDS;
};