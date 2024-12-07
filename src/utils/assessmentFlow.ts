import type { AssessmentData, AuditFormData } from '@/types/assessment';
import { calculateAutomationPotential } from './calculations';
import { generateCACResults } from './cacCalculations';

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

  // Calculate automation metrics
  const automationResults = calculateAutomationPotential({
    employees: formData.employees,
    timeSpent: "20",
    processVolume: formData.processVolume,
    errorRate: "3-5%",
    industry: formData.industry
  });

  // Calculate CAC and related metrics
  const cacResults = generateCACResults({
    industry: formData.industry,
    marketing_spend: "Less than $1,000",
    new_customers: "1-5 customers",
    manualProcesses: ["Data Entry"],
    toolStack: ["Spreadsheets"]
  });

  // Combine all results
  const finalData = {
    ...assessmentData,
    results: {
      automation: automationResults,
      cac: cacResults
    }
  };

  console.log('Transformed assessment data:', finalData);
  return finalData;
};