export interface SavingsInput {
  employeeCount: number;
  hourlyRate: number;
  automationPotential: number;
  processVolume: string;
  industry: string;
}

export const calculateAnnualSavings = ({
  employeeCount,
  hourlyRate,
  automationPotential,
  processVolume,
  industry
}: SavingsInput): number => {
  const baseHourlyRate = hourlyRate || 50; // Default hourly rate
  const annualHours = 2080; // Standard work hours per year
  const volumeMultiplier = getVolumeMultiplier(processVolume);
  const industryMultiplier = getIndustryMultiplier(industry);
  
  const potentialSavings = 
    employeeCount * 
    baseHourlyRate * 
    annualHours * 
    (automationPotential / 100) * 
    volumeMultiplier * 
    industryMultiplier;

  return Math.round(potentialSavings);
};

const getVolumeMultiplier = (processVolume: string): number => {
  const multipliers: Record<string, number> = {
    "Less than 100": 0.8,
    "100-500": 1,
    "501-1000": 1.2,
    "1001-5000": 1.4,
    "More than 5000": 1.6
  };
  return multipliers[processVolume] || 1;
};

const getIndustryMultiplier = (industry: string): number => {
  const multipliers: Record<string, number> = {
    'Healthcare': 1.2,
    'Financial Services': 1.3,
    'Technology': 1.25,
    'Manufacturing': 1.15,
    'Professional Services': 1.1,
    'Legal': 1.2,
    'Other': 1.0
  };
  return multipliers[industry] || 1.0;
};