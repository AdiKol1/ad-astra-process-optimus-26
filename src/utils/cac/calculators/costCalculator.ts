import { IndustryStandard } from '../industryStandards';

export const calculateCurrentCAC = (
  responses: Record<string, any>,
  standards: IndustryStandard
): number => {
  const baseCAC = standards.baseCAC;
  const manualProcessCount = responses.manualProcesses?.length || 0;
  const manualImpact = (manualProcessCount / 5) * standards.manualPenalty;
  
  return Math.round(baseCAC * (1 + manualImpact));
};

export const calculateTeamSizeMultiplier = (teamSize: string): number => {
  const sizes: Record<string, number> = {
    '1-5 employees': 0.8,
    '6-20 employees': 1.0,
    '21-50 employees': 1.2,
    '51-200 employees': 1.4,
    '201+ employees': 1.6
  };
  
  return sizes[teamSize] || 1.0;
};