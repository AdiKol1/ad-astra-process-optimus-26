interface ConversionFactors {
  industry: string;
  currentRate: number;
  automationLevel: number;
  toolsModernity: number;
}

export const calculateConversionImprovement = ({
  industry,
  currentRate,
  automationLevel,
  toolsModernity
}: ConversionFactors): number => {
  const industryPotentials = {
    'Healthcare': {
      maxImprovement: 0.35,    // 35% max improvement
      toolImpact: 0.15,        // 15% from modern tools
      automationImpact: 0.20   // 20% from automation
    },
    'Financial Services': {
      maxImprovement: 0.30,
      toolImpact: 0.12,
      automationImpact: 0.18
    },
    'Other': {
      maxImprovement: 0.25,
      toolImpact: 0.10,
      automationImpact: 0.15
    }
  };

  const potential = industryPotentials[industry] || industryPotentials.Other;
  
  // Calculate improvement based on current automation and tools
  const automationContribution = (automationLevel / 100) * potential.automationImpact;
  const toolsContribution = (toolsModernity / 100) * potential.toolImpact;
  
  const totalImprovement = Math.min(
    (automationContribution + toolsContribution),
    potential.maxImprovement
  );
  
  return Math.round(totalImprovement * 100); // Return as percentage
};