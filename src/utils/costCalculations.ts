interface CACFactors {
  industry: string;
  employeeCount: number;
  currentTools: string[];
  processVolume: string;
  automationLevel?: number; // Made optional to support both calculation methods
}

const VOLUME_MULTIPLIERS: Record<string, number> = {
  'Less than 100': 0.8,
  '100-500': 1,
  '501-1000': 1.2,
  '1001-5000': 1.4,
  'More than 5000': 1.6
};

export const calculateCACReduction = (params: CACFactors | { automationLevel: number; industry: string }): number => {
  // If it's the automation-based calculation
  if ('automationLevel' in params && Object.keys(params).length === 2) {
    const standards = INDUSTRY_STANDARDS[params.industry] || INDUSTRY_STANDARDS.Other;
    const baseReduction = (params.automationLevel / 100) * 30; // Base 30% max reduction
    return Math.min(Math.round(baseReduction * standards.savingsMultiplier), 25);
  }

  // Otherwise use the original company-size based calculation
  const { industry, employeeCount, currentTools, processVolume } = params as CACFactors;
  
  const baseReduction = {
    'Real Estate': 8,
    'Healthcare': 12,
    'Financial Services': 15,
    'Technology': 18,
    'Manufacturing': 10,
    'Professional Services': 12,
    'Other': 10
  }[industry] || 10;

  const sizeMultiplier = employeeCount <= 5 ? 0.8 :
                        employeeCount <= 20 ? 1 :
                        employeeCount <= 50 ? 1.2 : 1.3;

  const hasAdvancedTools = currentTools.some(tool => 
    !['Spreadsheets', 'Manual tracking', 'Basic CRM'].includes(tool)
  );
  const toolMultiplier = hasAdvancedTools ? 0.7 : 1;

  const volumeMultiplier = VOLUME_MULTIPLIERS[processVolume] || 1;

  const finalReduction = baseReduction * sizeMultiplier * toolMultiplier * volumeMultiplier;

  return Math.min(Math.round(finalReduction), 15);
};

// Add INDUSTRY_STANDARDS constant since it's used in the function
const INDUSTRY_STANDARDS = {
  'Real Estate': { savingsMultiplier: 0.8 },
  'Healthcare': { savingsMultiplier: 0.9 },
  'Financial Services': { savingsMultiplier: 1.1 },
  'Other': { savingsMultiplier: 1.0 }
};

export const calculateImplementationCost = ({
  industry,
  employeeCount,
  processVolume
}: Omit<CACFactors, 'currentTools' | 'automationLevel'>): number => {
  const baseCost = 15000;

  // Industry-specific multiplier
  const industryMultiplier = {
    'Real Estate': 0.9,
    'Healthcare': 1.3,
    'Financial Services': 1.2,
    'Technology': 1.1,
    'Manufacturing': 1.15,
    'Professional Services': 1,
    'Other': 1
  }[industry] || 1;

  // Size multiplier
  const sizeMultiplier = employeeCount <= 5 ? 0.8 :
                        employeeCount <= 20 ? 1 :
                        employeeCount <= 50 ? 1.3 : 1.5;

  // Volume multiplier
  const volumeMultiplier = VOLUME_MULTIPLIERS[processVolume] || 1;

  return Math.round(baseCost * industryMultiplier * sizeMultiplier * volumeMultiplier);
};
