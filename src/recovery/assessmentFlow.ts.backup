import type { AssessmentData, AuditFormData } from '@/types/assessment';

export const transformAuditFormData = (formData: AuditFormData): AssessmentData => {
  console.log('Transforming form data:', formData);
  
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
      timeSpent: 10,
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
    }
  };

  console.log('Transformed assessment data:', assessmentData);
  return assessmentData;
};