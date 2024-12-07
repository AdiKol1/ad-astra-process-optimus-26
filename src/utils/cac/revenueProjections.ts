interface RevenueFactors {
  industry: string;
  currentRevenue: number;
  automationLevel: number;
}

export const calculateRevenueGrowth = ({
  industry,
  currentRevenue,
  automationLevel
}: RevenueFactors): number => {
  const growthMultipliers = {
    'Healthcare': 1.4,      // 40% potential revenue growth
    'Financial Services': 1.35,
    'Technology': 1.3,
    'Other': 1.25
  };

  const multiplier = growthMultipliers[industry] || growthMultipliers.Other;
  const automationImpact = automationLevel / 100;
  
  // Calculate potential revenue increase
  const potentialGrowth = currentRevenue * (multiplier - 1) * automationImpact;
  
  return Math.round(potentialGrowth);
};

export const calculateROI = (
  annualSavings: number,
  revenueGrowth: number,
  implementationCost: number
): number => {
  const totalBenefit = annualSavings + revenueGrowth;
  const roi = (totalBenefit / implementationCost) * 100;
  
  // Cap ROI at 300% to maintain credibility
  return Math.min(Math.round(roi), 300);
};