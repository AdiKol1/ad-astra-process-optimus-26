interface CACFactors {
  industry: string;
  employeeCount: number;
  currentTools: string[];
  processVolume: string;
}

const VOLUME_MULTIPLIERS: Record<string, number> = {
  'Less than 100': 0.8,
  '100-500': 1,
  '501-1000': 1.2,
  '1001-5000': 1.4,
  'More than 5000': 1.6
};

export const calculateCACReduction = ({
  industry,
  employeeCount,
  currentTools,
  processVolume
}: CACFactors): number => {
  // Base reduction potential based on industry
  const baseReduction = {
    'Real Estate': 8, // Conservative 8% base for real estate
    'Healthcare': 12,
    'Financial Services': 15,
    'Technology': 18,
    'Manufacturing': 10,
    'Professional Services': 12,
    'Other': 10
  }[industry] || 10;

  // Adjust based on company size (smaller companies have less reduction potential)
  const sizeMultiplier = employeeCount <= 5 ? 0.8 :
                        employeeCount <= 20 ? 1 :
                        employeeCount <= 50 ? 1.2 : 1.3;

  // Adjust based on current tools (more sophisticated tools = less potential reduction)
  const hasAdvancedTools = currentTools.some(tool => 
    !['Spreadsheets', 'Manual tracking', 'Basic CRM'].includes(tool)
  );
  const toolMultiplier = hasAdvancedTools ? 0.7 : 1;

  // Adjust based on process volume
  const volumeMultiplier = VOLUME_MULTIPLIERS[processVolume] || 1;

  // Calculate final reduction percentage
  const finalReduction = baseReduction * sizeMultiplier * toolMultiplier * volumeMultiplier;

  // Cap the maximum reduction at 15% for realistic expectations
  return Math.min(Math.round(finalReduction), 15);
};

export const calculateImplementationCost = ({
  industry,
  employeeCount,
  processVolume
}: Omit<CACFactors, 'currentTools'>): number => {
  // Base implementation cost
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