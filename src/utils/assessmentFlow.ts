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
  const automationScore = calculateAutomationPotential(data);

  return {
    assessmentScore: {
      overall: assessmentScore.overall,
      automationPotential: automationScore.efficiency.productivity,
      sections: assessmentScore.sections
    },
    results: {
      savings: {
        annual: automationScore.savings.annual
      }
    },
    recommendations: generateRecommendations(data),
    industryAnalysis: {
      benchmarks: {
        averageProcessingTime: "4 hours",
        errorRates: "5%",
        automationLevel: "60%",
        costSavings: "$100,000"
      },
      opportunities: ["Process Automation", "Data Integration"],
      risks: ["Change Management", "Training Requirements"],
      trends: ["AI Adoption", "Cloud Migration"]
    }
  };
};