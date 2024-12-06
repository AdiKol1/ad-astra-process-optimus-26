import type { AssessmentData, AuditFormData } from '@/types/assessment';
import { calculateAutomationPotential } from './calculations';

export const transformAuditFormData = (formData: AuditFormData): AssessmentData => {
  console.log('Transforming form data:', formData);
  
  // Calculate potential savings and efficiency metrics
  const calculations = calculateAutomationPotential({
    employees: formData.employees,
    timeSpent: '20', // Default to medium value for initial assessment
    processVolume: formData.processVolume,
    errorRate: '3-5%' // Default to average error rate
  });

  console.log('Calculation results:', calculations);

  const assessmentData: AssessmentData = {
    processDetails: {
      employees: parseInt(formData.employees) || 0,
      processVolume: formData.processVolume,
      industry: formData.industry,
      timeline: formData.timelineExpectation
    },
    technology: {
      currentSystems: ["Spreadsheets"],
      integrationNeeds: []
    },
    processes: {
      manualProcesses: ["Data Entry"],
      timeSpent: calculations.efficiency.timeReduction,
      errorRate: "3-5%"
    },
    team: {
      teamSize: parseInt(formData.employees) || 0,
      departments: ["Operations"]
    },
    challenges: {
      painPoints: ["Manual data entry"],
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