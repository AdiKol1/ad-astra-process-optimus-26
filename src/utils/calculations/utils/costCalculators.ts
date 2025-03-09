// Removed unused/invalid import for IndustryStandard

export const calculateLaborCosts = (
  employees: number,
  timeSpent: number,
  hourlyRate: number
): number => {
  const weeksPerYear = 52;
  return employees * timeSpent * weeksPerYear * hourlyRate;
};

export const calculateOperationalCosts = (
  processVolume: string,
  standards: { processingTimeMultiplier: number }
): number => {
  const baseVolumeCosts: Record<string, number> = {
    "Less than 100": 500,
    "100-500": 1500,
    "501-1000": 3000,
    "1001-5000": 6000,
    "More than 5000": 12000
  };
  return (baseVolumeCosts[processVolume] || 1500) * standards.processingTimeMultiplier;
};

export const calculateErrorCosts = (
  processVolume: string,
  errorRate: string,
  standards: { costPerError: number; savingsMultiplier: number }
): number => {
  const volumeMap: { [key in 'Less than 100' | '100-500' | '501-1000' | '1001-5000' | 'More than 5000']: number } = {
    "Less than 100": 100,
    "100-500": 200,
    "501-1000": 300,
    "1001-5000": 400,
    "More than 5000": 500,
  };
  const errorRateMap: { [key in '1-2%' | '3-5%' | '6-10%' | 'More than 10%']: number } = {
    "1-2%": 0.02,
    "3-5%": 0.04,
    "6-10%": 0.08,
    "More than 10%": 0.12,
  };

  const volume = volumeMap[processVolume] || 250;
  const rate = errorRateMap[errorRate] || 0.04;

  return volume * rate * standards.costPerError * 12;
};

export const calculateOverheadCosts = (
  employees: number,
  standards: { processingTimeMultiplier: number }
): number => {
  const baseOverhead = 1000;
  return baseOverhead * employees * standards.processingTimeMultiplier;
};