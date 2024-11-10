import type { AssessmentData, AuditFormData } from '@/types/assessment';

export const transformAuditFormData = (formData: AuditFormData): AssessmentData => {
  return {
    processDetails: {
      employees: parseInt(formData.employees),
      processVolume: formData.processVolume,
      industry: formData.industry,
      timeline: formData.timelineExpectation
    },
    technology: {
      currentSystems: [],
      integrationNeeds: []
    },
    processes: {
      manualProcesses: [],
      timeSpent: 0,
      errorRate: "1-2%"
    },
    team: {
      teamSize: parseInt(formData.employees),
      departments: []
    },
    challenges: {
      painPoints: [],
      priority: "efficiency"
    },
    goals: {
      objectives: [],
      expectedOutcomes: []
    }
  };
};