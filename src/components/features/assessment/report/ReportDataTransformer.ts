import { AssessmentData, AssessmentResults } from '@/types/assessment';
import { calculateAutomationPotential } from '@/utils/calculations';
import { calculateMarketingScore } from '@/utils/marketingScoring';

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

  // Calculate marketing score and efficiency
  const marketingScore = calculateMarketingScore(assessmentData.marketing);
  const marketingEfficiency = marketingScore.metrics.marketingEfficiency;
  
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
      recommendations: marketingScore.recommendedServices.map(title => ({
        title,
        description: 'Implement marketing automation and optimization strategies',
        impact: marketingScore.priority,
        timeframe: 'short-term',
        benefits: [
          'Improved marketing efficiency',
          'Better lead tracking',
          'Enhanced campaign performance',
          'Cost optimization'
        ]
      }))
    }
  };
};