import { IndustryStandard } from '../types/calculationTypes';

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
  standards: IndustryStandard
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
  standards: IndustryStandard
): number => {
  const volumeMap = {
    "Less than 100": 50,
    "100-500": 250,
    "501-1000": 750,
    "1001-5000": 2500,
    "More than 5000": 5000
  };
  
  const errorRateMap = {
    "1-2%": 0.015,
    "3-5%": 0.04,
    "6-10%": 0.08,
    "More than 10%": 0.12
  };

  const volume = volumeMap[processVolume] || 250;
  const rate = errorRateMap[errorRate] || 0.04;

  return volume * rate * standards.costPerError * 12;
};

export const calculateOverheadCosts = (
  employees: number,
  standards: IndustryStandard
): number => {
  const baseOverhead = 1000;
  return baseOverhead * employees * standards.processingTimeMultiplier;
};