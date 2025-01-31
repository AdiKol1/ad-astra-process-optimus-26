import { CACMetrics } from '@/types/assessment/calculations';
import { logger } from '@/utils/logger';

interface CACInput {
  industry: string;
  marketing_spend: number;
  new_customers: number;
  manualProcesses: string[];
  toolStack: string[];
}

const INDUSTRY_BENCHMARKS = {
  technology: { baseCAC: 200, automationImpact: 0.3 },
  healthcare: { baseCAC: 300, automationImpact: 0.25 },
  finance: { baseCAC: 400, automationImpact: 0.2 },
  retail: { baseCAC: 150, automationImpact: 0.15 },
  manufacturing: { baseCAC: 250, automationImpact: 0.2 },
  default: { baseCAC: 200, automationImpact: 0.2 }
};

const TOOL_IMPACT_WEIGHTS = {
  crm: 0.15,
  marketing: 0.2,
  sales: 0.15,
  automation: 0.3,
  analytics: 0.2
};

export const generateCACResults = (input: CACInput): CACMetrics => {
  logger.info('Generating CAC results with input:', input);

  try {
    const {
      industry,
      marketing_spend,
      new_customers,
      manualProcesses,
      toolStack
    } = input;

    // Get industry benchmarks
    const benchmark = INDUSTRY_BENCHMARKS[industry as keyof typeof INDUSTRY_BENCHMARKS] || INDUSTRY_BENCHMARKS.default;

    // Calculate technology score based on tool stack
    const toolScore = calculateToolScore(toolStack);
    
    // Calculate process impact based on manual processes
    const processImpact = calculateProcessImpact(manualProcesses);

    // Calculate overall technology score
    const technologyScore = Math.round((toolScore + processImpact) * 50);

    // Generate recommendations based on analysis
    const recommendations = generateRecommendations(input, toolScore, processImpact);

    return {
      technologyScore,
      recommendations
    };
  } catch (error) {
    const err = error as Error;
    logger.error('Error generating CAC results:', { message: err.message, stack: err.stack });
    return {
      technologyScore: 0,
      recommendations: []
    };
  }
};

const calculateToolScore = (toolStack: string[]): number => {
  if (!toolStack.length) return 0;

  let score = 0;
  const toolTypes = Object.keys(TOOL_IMPACT_WEIGHTS);

  toolStack.forEach(tool => {
    const toolType = toolTypes.find(type => tool.toLowerCase().includes(type));
    if (toolType) {
      score += TOOL_IMPACT_WEIGHTS[toolType as keyof typeof TOOL_IMPACT_WEIGHTS];
    }
  });

  return Math.min(1, score);
};

const calculateProcessImpact = (manualProcesses: string[]): number => {
  const processCount = manualProcesses.length;
  if (processCount === 0) return 1;
  if (processCount <= 2) return 0.8;
  if (processCount <= 5) return 0.6;
  if (processCount <= 8) return 0.4;
  return 0.2;
};

const generateRecommendations = (
  input: CACInput,
  toolScore: number,
  processImpact: number
): CACMetrics['recommendations'] => {
  const recommendations: CACMetrics['recommendations'] = [];

  // Tool Stack Recommendations
  if (toolScore < 0.5) {
    recommendations.push({
      area: 'technology',
      title: 'Marketing Technology Stack Enhancement',
      description: 'Your marketing technology stack could be enhanced to improve efficiency.',
      priority: 'high',
      impact: 'High potential for CAC reduction',
      effort: 'Medium to High'
    });
  }

  // Process Recommendations
  if (processImpact < 0.6) {
    recommendations.push({
      area: 'process',
      title: 'Marketing Process Automation',
      description: 'Consider automating key marketing processes to reduce costs.',
      priority: 'medium',
      impact: 'Medium to High cost reduction',
      effort: 'Medium'
    });
  }

  // Tool Integration Recommendation
  if (input.toolStack.length < 3) {
    recommendations.push({
      area: 'technology',
      title: 'Marketing Tool Integration',
      description: 'Implement integrated marketing tools to streamline operations.',
      priority: 'high',
      impact: 'High efficiency improvement',
      effort: 'Medium to High'
    });
  }

  return recommendations;
};