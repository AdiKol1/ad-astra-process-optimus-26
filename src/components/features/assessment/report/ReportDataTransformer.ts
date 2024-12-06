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

  return {
    assessmentScore: {
      overall: calculations.efficiency.productivity,
      automationPotential: calculations.efficiency.productivity,
      sections: {
        process: { percentage: 75 },
        technology: { percentage: 60 },
        team: { percentage: 80 }
      }
    },
    results: {
      annual: {
        savings: calculations.savings.annual,
        hours: calculations.efficiency.timeReduction * 52
      }
    },
    recommendations: {
      recommendations: [
        {
          title: 'Process Automation',
          description: 'Implement automation for key manual processes',
          impact: 'high',
          timeframe: 'short-term',
          benefits: ['Reduced processing time', 'Fewer errors', 'Cost savings']
        }
      ]
    }
  };
};