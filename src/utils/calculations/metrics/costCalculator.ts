import { INDUSTRY_STANDARDS, IndustryType } from '../industry/industryStandards';

export const calculateErrorCosts = (
  processVolume: string,
  errorRate: string,
  costPerError: number
): number => {
  const volumeMap: Record<string, number> = {
    "Less than 100": 50,
    "100-500": 250,
    "501-1000": 750,
    "1001-5000": 2500,
    "More than 5000": 5000
  };
  
  const errorRateMap: Record<string, number> = {
    "1-2%": 0.015,
    "3-5%": 0.04,
    "6-10%": 0.08,
    "More than 10%": 0.12
  };

  const volume = volumeMap[processVolume] || 250;
  const rate = errorRateMap[errorRate] || 0.04;

  return volume * rate * costPerError * 12;
};

export const calculateOperationalCosts = (
  processVolume: string,
  industry: IndustryType
): number => {
  const standards = INDUSTRY_STANDARDS[industry] || INDUSTRY_STANDARDS.Other;
  const baseVolumeCosts: Record<string, number> = {
    "Less than 100": 500,
    "100-500": 1500,
    "501-1000": 3000,
    "1001-5000": 6000,
    "More than 5000": 12000
  };
  return baseVolumeCosts[processVolume] * standards.processingTimeMultiplier || 1500;
};