import type { AssessmentData, AuditFormData } from '@/types/assessment';
import { calculateAutomationPotential } from './calculations';

const parseTimeSpent = (timeSpent: string[] | string): number => {
  if (Array.isArray(timeSpent)) {
    const value = timeSpent[0];
    if (value.includes('Less than 10')) return 5;
    if (value.includes('10-20')) return 15;
    if (value.includes('20-30')) return 25;
    if (value.includes('30-40')) return 35;
    if (value.includes('More than 40')) return 45;
    return 10; // default
  }
  return parseInt(timeSpent) || 10;
};

const parseErrorRate = (errorRate: string[] | string): string => {
  if (Array.isArray(errorRate)) {
    return errorRate[0];
  }
  return errorRate;
};

export const transformAuditFormData = (formData: AuditFormData): AssessmentData => {
  console.log('Starting transformation of form data:', formData);
  
  // Parse team size from "1-5 employees" format to number
  const teamSize = Array.isArray(formData.employees) 
    ? parseInt(formData.employees[0].split('-')[0]) 
    : parseInt(formData.employees) || 1;

  // Calculate potential savings and efficiency metrics
  const calculations = calculateAutomationPotential({
    employees: String(teamSize),
    timeSpent: String(parseTimeSpent(formData.timeSpent || '10')),
    processVolume: formData.processVolume,
    errorRate: parseErrorRate(formData.errorRate || '3-5%'),
    industry: formData.industry
  });

  console.log('Calculation results:', calculations);

  const assessmentData: AssessmentData = {
    processDetails: {
      employees: teamSize,
      processVolume: formData.processVolume,
      industry: formData.industry,
      timeline: formData.timelineExpectation
    },
    technology: {
      currentSystems: Array.isArray(formData.toolStack) ? formData.toolStack : ["Spreadsheets"],
      integrationNeeds: []
    },
    processes: {
      manualProcesses: Array.isArray(formData.manualProcesses) ? formData.manualProcesses : ["Data Entry"],
      timeSpent: parseTimeSpent(formData.timeSpent || '10'),
      errorRate: parseErrorRate(formData.errorRate || '3-5%')
    },
    team: {
      teamSize: teamSize,
      departments: ["Operations"]
    },
    challenges: {
      painPoints: Array.isArray(formData.marketingChallenges) ? formData.marketingChallenges : [],
      priority: "Efficiency"
    },
    goals: {
      objectives: ["Process automation"],
      expectedOutcomes: ["Reduced processing time"]
    },
    results: {
      annual: {
        savings: calculations.savings.annual,
        hours: calculations.efficiency.timeReduction * 52 // Convert weekly to annual
      },
      automationPotential: calculations.efficiency.productivity,
      roi: calculations.savings.annual / (calculations.costs.projected || 1)
    }
  };

  console.log('Transformed assessment data:', assessmentData);
  return assessmentData;
};