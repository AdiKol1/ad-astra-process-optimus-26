interface CACFactors {
  industry: string;
  employeeCount: number;
  currentTools: string[];
  processVolume: string;
  automationLevel?: number;
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
    // Increased base reduction potential since automation significantly impacts CAC
    const baseReduction = ((params.automationLevel ?? 0) / 100) * 45; // Increased from 30% to 45% max reduction
    return Math.min(Math.round(baseReduction * standards.savingsMultiplier), 35); // Increased cap from 25% to 35%
  }

  // Company-size based calculation with enhanced automation consideration
  const { industry, employeeCount, currentTools, processVolume } = params as CACFactors;
  
  const baseReduction = {
    'Real Estate': 12, // Increased from 8
    'Healthcare': 15, // Increased from 12
    'Financial Services': 18, // Increased from 15
    'Technology': 22, // Increased from 18
    'Manufacturing': 14, // Increased from 10
    'Professional Services': 16, // Increased from 12
    'Other': 13 // Increased from 10
  }[industry] || 13;

  const sizeMultiplier = employeeCount <= 5 ? 0.9 : // Increased from 0.8
                        employeeCount <= 20 ? 1.1 : // Increased from 1.0
                        employeeCount <= 50 ? 1.3 : 1.4; // Increased multipliers

  const hasAdvancedTools = currentTools.some(tool => 
    !['Spreadsheets', 'Manual tracking', 'Basic CRM'].includes(tool)
  );
  const toolMultiplier = hasAdvancedTools ? 0.8 : 1; // Adjusted from 0.7 to 0.8 to reflect better tool integration

  const volumeMultiplier = VOLUME_MULTIPLIERS[processVolume] || 1;

  const finalReduction = baseReduction * sizeMultiplier * toolMultiplier * volumeMultiplier;

  return Math.min(Math.round(finalReduction), 25); // Increased cap from 15% to 25%
};

// Industry standards with adjusted multipliers
const INDUSTRY_STANDARDS = {
  'Real Estate': { savingsMultiplier: 0.9 }, // Increased from 0.8
  'Healthcare': { savingsMultiplier: 1.1 }, // Increased from 0.9
  'Financial Services': { savingsMultiplier: 1.2 }, // Increased from 1.1
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
