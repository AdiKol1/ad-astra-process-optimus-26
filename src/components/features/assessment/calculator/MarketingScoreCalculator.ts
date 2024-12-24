import { MarketingResponses } from '@/types/assessment/marketing';

interface MarketingScore {
  score: number;
  conversionRate: number;
  conversionImprovement: number;
  projectedRevenue: number;
  automationPotential: number;
  automationCoverage: number;
  automationImpact: number;
}

export const calculateMarketingScore = (responses: MarketingResponses): MarketingScore => {
  // Default values if responses are missing
  const conversionRate = responses?.conversion?.rate || 0;
  const conversionImprovement = responses?.conversion?.improvement || 0;
  const projectedRevenue = responses?.conversion?.projectedRevenue || 0;
  const automationPotential = responses?.automation?.potential || 0;
  const automationCoverage = responses?.automation?.coverage || 0;
  const automationImpact = responses?.automation?.impact || 0;

  // Calculate weighted score
  const conversionWeight = 0.4;
  const automationWeight = 0.6;

  const conversionScore = (conversionRate + conversionImprovement) / 2;
  const automationScore = (automationPotential + automationCoverage + automationImpact) / 3;

  const score = (conversionScore * conversionWeight) + (automationScore * automationWeight);

  return {
    score,
    conversionRate,
    conversionImprovement,
    projectedRevenue,
    automationPotential,
    automationCoverage,
    automationImpact
  };
};
