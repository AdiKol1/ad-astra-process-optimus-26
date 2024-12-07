import { AssessmentData, AssessmentResults } from '@/types/assessment';
import { calculateAutomationPotential } from '@/utils/calculations';

export const transformAssessmentData = (responses: Record<string, any>): AssessmentData => {
  console.log('Transforming assessment responses:', responses);
  
  // Extract employee count and other key metrics
  const employeeCount = responses.teamSize?.[0]?.split(' ')?.[0]?.split('-')?.[0] || '1';
  const timeSpent = responses.timeSpent?.[0]?.split(' ')?.[0] || '10';
  
  return {
    processDetails: {
      employees: parseInt(employeeCount),
      processVolume: responses.processVolume || '100-500',
      industry: responses.industry || 'Other',
      timeline: responses.timeline || '3_months'
    },
    technology: {
      currentSystems: responses.toolStack || ['Spreadsheets'],
      integrationNeeds: []
    },
    processes: {
      manualProcesses: responses.manualProcesses || [],
      timeSpent: parseInt(timeSpent),
      errorRate: responses.errorRate || '3-5%'
    },
    team: {
      teamSize: parseInt(employeeCount),
      departments: ['Operations']
    },
    challenges: {
      painPoints: responses.painPoints || [],
      priority: 'Efficiency'
    },
    goals: {
      objectives: ['Process automation'],
      expectedOutcomes: ['Reduced processing time']
    },
    marketing: {
      challenges: responses.marketingChallenges || [],
      tools: responses.toolStack || [],
      metrics: responses.metricsTracking || [],
      automationLevel: responses.automationLevel || '0-25%',
      budget: responses.marketingBudget || 'Less than $1,000'
    }
  };
};

export const calculateResults = (assessmentData: AssessmentData): AssessmentResults => {
  console.log('Calculating results from assessment data:', assessmentData);
  
  const calculations = calculateAutomationPotential({
    employees: String(assessmentData.processDetails.employees),
    timeSpent: String(assessmentData.processes.timeSpent),
    processVolume: assessmentData.processDetails.processVolume,
    errorRate: assessmentData.processes.errorRate,
    industry: assessmentData.processDetails.industry
  });

  // Calculate marketing efficiency score
  const marketingEfficiency = calculateMarketingEfficiency(assessmentData.marketing);
  
  // Adjust automation potential based on marketing metrics
  const adjustedAutomationPotential = Math.min(
    calculations.efficiency.productivity + (marketingEfficiency * 0.2),
    100
  );

  return {
    assessmentScore: {
      overall: calculations.efficiency.productivity,
      automationPotential: adjustedAutomationPotential,
      sections: {
        process: { percentage: 75 },
        technology: { percentage: 60 },
        team: { percentage: 80 },
        marketing: { percentage: marketingEfficiency }
      }
    },
    results: {
      annual: {
        savings: calculations.savings.annual,
        hours: calculations.efficiency.timeReduction * 52
      }
    },
    recommendations: {
      recommendations: generateMarketingRecommendations(assessmentData.marketing)
    }
  };
};

const calculateMarketingEfficiency = (marketing: any): number => {
  // Calculate tool sophistication (0-100)
  const toolScore = marketing.tools.reduce((score: number, tool: string) => {
    if (tool === 'Marketing automation platform') return score + 30;
    if (tool === 'CRM system') return score + 25;
    if (tool === 'Analytics tools') return score + 20;
    return score + 10;
  }, 0);

  // Calculate metrics tracking maturity (0-100)
  const metricsScore = Math.min((marketing.metrics.length / 8) * 100, 100);

  // Parse automation level
  const automationScore = parseInt(marketing.automationLevel?.split('-')[1] || '25');

  // Calculate weighted average
  return Math.round(
    (toolScore * 0.4) +
    (metricsScore * 0.3) +
    (automationScore * 0.3)
  );
};

const generateMarketingRecommendations = (marketing: any) => {
  const recommendations = [];

  // Add recommendations based on automation level
  if (marketing.automationLevel === '0-25%') {
    recommendations.push({
      title: 'Marketing Automation Implementation',
      description: 'Implement basic marketing automation to improve efficiency',
      impact: 'high',
      timeframe: 'short-term',
      benefits: ['Reduced manual work', 'Improved lead tracking', 'Better campaign management']
    });
  }

  // Add recommendations based on metrics tracking
  if (marketing.metrics.length < 4) {
    recommendations.push({
      title: 'Enhanced Analytics Setup',
      description: 'Implement comprehensive marketing metrics tracking',
      impact: 'medium',
      timeframe: 'short-term',
      benefits: ['Better decision making', 'ROI tracking', 'Performance optimization']
    });
  }

  return recommendations;
};