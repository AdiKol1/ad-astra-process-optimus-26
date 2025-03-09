import { ProcessMetrics, ProcessResults, ProcessData } from '@/types/assessment/calculations';
import { INDUSTRY_CONFIGS, IndustryType } from '@/types/industryConfig';
import { logger } from '@/utils/logger';

const AUTOMATION_FACTORS = {
  timeReduction: 0.65,  // 65% time reduction
  errorReduction: 0.85, // 85% error reduction
  overheadReduction: 0.45 // 45% overhead reduction
};

const PROCESS_WEIGHTS = {
  manualProcesses: 0.3,
  teamSize: 0.2,
  toolStack: 0.3,
  industry: 0.2
};

const INDUSTRY_BENCHMARKS = {
  technology: { efficiency: 0.8, automation: 0.7 },
  healthcare: { efficiency: 0.6, automation: 0.5 },
  finance: { efficiency: 0.7, automation: 0.6 },
  retail: { efficiency: 0.5, automation: 0.4 },
  manufacturing: { efficiency: 0.6, automation: 0.5 },
  default: { efficiency: 0.5, automation: 0.4 }
};

export const calculateProcessMetrics = (data: ProcessData | ProcessMetrics): ProcessResults => {
  logger.info('Calculating process metrics with data:', data);

  // Handle both ProcessData and ProcessMetrics input types
  const metrics = 'responses' in data ? {
    manualProcesses: data.responses.manualProcesses || [],
    teamSize: data.responses.teamSize || 0,
    toolStack: data.responses.toolStack || [],
    industry: data.responses.industry || 'default'
  } : {
    manualProcesses: Array(data.manualProcessCount || 0).fill('process'),
    teamSize: Math.ceil(data.timeSpent / 40) || 0, // Estimate team size from time spent
    toolStack: [],
    industry: data.industry || 'default'
  };

  // Calculate base scores
  const manualProcessScore = Math.max(0, 100 - (metrics.manualProcesses.length * 10));
  const teamSizeScore = calculateTeamSizeScore(metrics.teamSize);
  const toolStackScore = calculateToolStackScore(metrics.toolStack);
  const industryScore = calculateIndustryScore(metrics.industry);

  // Calculate weighted scores
  const processScore = Math.round(
    manualProcessScore * PROCESS_WEIGHTS.manualProcesses +
    teamSizeScore * PROCESS_WEIGHTS.teamSize +
    toolStackScore * PROCESS_WEIGHTS.toolStack +
    industryScore * PROCESS_WEIGHTS.industry
  );

  // Generate recommendations
  const recommendations = generateRecommendations(data);

  return {
    score: processScore,
    teamScore: teamSizeScore,
    recommendations
  };
};

const calculateTeamSizeScore = (teamSize: number): number => {
  if (teamSize <= 0) return 0;
  if (teamSize <= 5) return 90;
  if (teamSize <= 20) return 80;
  if (teamSize <= 50) return 70;
  if (teamSize <= 100) return 60;
  return 50;
};

const calculateToolStackScore = (toolStack: string[]): number => {
  const toolCount = toolStack.length;
  if (toolCount === 0) return 30;
  if (toolCount <= 2) return 50;
  if (toolCount <= 5) return 70;
  if (toolCount <= 8) return 85;
  return 100;
};

const calculateIndustryScore = (industry: string): number => {
  const benchmark = INDUSTRY_BENCHMARKS[industry as keyof typeof INDUSTRY_BENCHMARKS] || INDUSTRY_BENCHMARKS.default;
  return Math.round((benchmark.efficiency + benchmark.automation) * 50);
};

const generateRecommendations = (data: ProcessData): ProcessResults['recommendations'] => {
  const recommendations: ProcessResults['recommendations'] = [];
  const { responses } = data;
  const {
    manualProcesses = [],
    teamSize = 0,
    toolStack = [],
    industry = 'default'
  } = responses;

  // Manual Processes Recommendations
  if (manualProcesses.length > 5) {
    recommendations.push({
      area: 'process',
      title: 'High Manual Process Load',
      description: 'Your team has a high number of manual processes that could be automated.',
      priority: 'high',
      impact: 'High potential for efficiency gains',
      effort: 'Medium to High'
    });
  }

  // Team Size Recommendations
  if (teamSize > 50) {
    recommendations.push({
      area: 'team',
      title: 'Large Team Optimization',
      description: 'Consider breaking down the team into smaller, focused units for better efficiency.',
      priority: 'medium',
      impact: 'Medium to High efficiency improvement',
      effort: 'Medium'
    });
  }

  // Tool Stack Recommendations
  if (toolStack.length < 3) {
    recommendations.push({
      area: 'technology',
      title: 'Limited Tool Usage',
      description: 'Your team could benefit from adopting more automation tools.',
      priority: 'high',
      impact: 'High potential for automation',
      effort: 'Medium'
    });
  }

  return recommendations;
};

export const validateProcessMetrics = (metrics: Partial<ProcessMetrics>): boolean => {
  if (!metrics) return false;

  const requiredFields: (keyof ProcessMetrics)[] = [
    'timeSpent',
    'errorRate',
    'processVolume',
    'manualProcessCount',
    'industry'
  ];

  // Check for required fields
  const hasAllFields = requiredFields.every(field => metrics[field] !== undefined);
  if (!hasAllFields) {
    logger.warn('Missing required fields in process metrics', { 
      metrics,
      missingFields: requiredFields.filter(field => metrics[field] === undefined)
    });
    return false;
  }

  // Validate numeric fields
  const numericFields = ['timeSpent', 'errorRate', 'processVolume', 'manualProcessCount'];
  const validNumbers = numericFields.every(field => {
    const value = metrics[field as keyof ProcessMetrics] as number;
    return typeof value === 'number' && !isNaN(value) && value >= -Infinity;
  });

  if (!validNumbers) {
    logger.warn('Invalid numeric fields in process metrics', {
      invalidFields: numericFields.filter(field => {
        const value = metrics[field as keyof ProcessMetrics] as number;
        return typeof value !== 'number' || isNaN(value) || value < -Infinity;
      })
    });
    return false;
  }

  // Validate ranges
  if (metrics.timeSpent! < 0) {
    logger.warn('Invalid time spent value', { timeSpent: metrics.timeSpent });
    return false;
  }

  if (metrics.processVolume! < 0) {
    logger.warn('Invalid process volume value', { processVolume: metrics.processVolume });
    return false;
  }

  if (metrics.manualProcessCount! < 0) {
    logger.warn('Invalid manual process count', { manualProcessCount: metrics.manualProcessCount });
    return false;
  }

  // Validate industry
  if (!Object.keys(INDUSTRY_CONFIGS).includes(metrics.industry! as IndustryType)) {
    logger.warn('Invalid industry type', { industry: metrics.industry });
    return false;
  }

  return true;
};
