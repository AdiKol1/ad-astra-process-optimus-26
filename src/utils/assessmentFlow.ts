import type { AssessmentData, AuditFormData } from '@/types/assessment';
import { calculateAutomationPotential } from './calculations';
import { generateCACResults } from './cacCalculations';
import { calculateMarketingScore } from './marketingScoring';

export const transformAuditFormData = (formData: AuditFormData): AssessmentData => {
  console.log('Transforming form data:', formData);
  
  // Transform basic form data
  const assessmentData: AssessmentData = {
    processDetails: {
      employees: parseInt(formData.employees) || 0,
      processVolume: formData.processVolume,
      industry: formData.industry,
      timeline: formData.timelineExpectation
    },
    technology: {
      currentSystems: formData.toolStack || ["Spreadsheets"],
      integrationNeeds: []
    },
    processes: {
      manualProcesses: formData.manualProcesses || ["Data Entry"],
      timeSpent: 10,
      errorRate: formData.errorRate || "3-5%"
    },
    team: {
      teamSize: parseInt(formData.employees) || 0,
      departments: ["Operations"]
    },
    challenges: {
      painPoints: formData.marketingChallenges || [],
      priority: "Efficiency"
    },
    goals: {
      objectives: ["Process automation"],
      expectedOutcomes: ["Reduced processing time"]
    },
    marketing: {
      challenges: formData.marketingChallenges || [],
      tools: formData.toolStack || [],
      metrics: formData.metricsTracking || [],
      automationLevel: formData.automationLevel || "0-25%"
    }
  };

  // Calculate automation metrics
  const automationResults = calculateAutomationPotential({
    employees: formData.employees,
    timeSpent: "20",
    processVolume: formData.processVolume,
    errorRate: formData.errorRate || "3-5%",
    industry: formData.industry
  });

  // Calculate marketing metrics
  const marketingScore = calculateMarketingScore({
    marketingChallenges: formData.marketingChallenges || [],
    toolStack: formData.toolStack || [],
    metricsTracking: formData.metricsTracking || [],
    automationLevel: formData.automationLevel
  });

  // Calculate CAC and related metrics
  const cacResults = generateCACResults({
    industry: formData.industry,
    marketing_spend: formData.marketing_spend || "Less than $1,000",
    new_customers: formData.new_customers || "1-5 customers",
    manualProcesses: formData.manualProcesses || ["Data Entry"],
    toolStack: formData.toolStack || ["Spreadsheets"]
  });

  // Combine all results
  const finalData = {
    ...assessmentData,
    results: {
      automation: automationResults,
      marketing: marketingScore,
      cac: cacResults
    }
  };

  console.log('Transformed assessment data:', finalData);
  return finalData;
};