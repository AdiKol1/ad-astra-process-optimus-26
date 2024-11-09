import type { AssessmentData, AuditFormData, AssessmentResults } from '@/types/assessment';
import { calculateAssessmentScore } from './scoring';
import { calculateAutomationPotential } from './calculations';
import { generateRecommendations } from './recommendations';

export const transformAuditFormData = (formData: AuditFormData): AssessmentData => {
  return {
    processDetails: {
      employees: parseInt(formData.employees),
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
      teamSize: parseInt(formData.employees),
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

export const processAssessmentData = (data: AssessmentData): AssessmentResults => {
  const assessmentScore = calculateAssessmentScore(data);
  const results = calculateAutomationPotential(data);
  const recommendations = generateRecommendations(data);

  return {
    assessmentScore,
    results,
    recommendations
  };
};