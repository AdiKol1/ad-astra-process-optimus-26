import type { AssessmentData, AuditFormData } from '@/types/assessment';

export const transformAuditFormData = (formData: AuditFormData): AssessmentData => {
  return {
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
      timeSpent: 10,
      errorRate: "3-5%"
    },
    team: {
      teamSize: parseInt(formData.employees) || 0,
      departments: ["Operations"]
    },
    challenges: {
      painPoints: ["Too much manual data entry"],
      priority: "Speed up processing time"
    },
    goals: {
      objectives: ["Reduce operational costs"],
      expectedOutcomes: ["50%+ time savings"]
    }
  };
};