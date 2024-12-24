import { IndustryConfig } from '../config/industryConfigs';
import { AssessmentInput } from '../types/assessmentTypes';

const parseTimeSpent = (timeSpent: string[] = []): number => {
  const hours = timeSpent[0]?.split(' ')?.[0]?.split('-')?.[0] || '10';
  return parseInt(hours, 10);
};

const parseTeamSize = (teamSize: string[]): number => {
  const size = teamSize[0]?.split(' ')?.[0]?.split('-')?.[0] || '1';
  return parseInt(size, 10);
};

export const calculateAutomation = (input: AssessmentInput, config: IndustryConfig) => {
  console.log('Calculating automation metrics with input:', input);

  const weeklyHours = parseTimeSpent(input.timeSpent);
  const employeeCount = parseTeamSize(input.teamSize);
  
  // Calculate time reduction
  const annualHours = weeklyHours * 52;
  const timeReduction = Math.round(annualHours * config.automationPotential);
  
  // Calculate error reduction
  const errorReduction = Math.round((1 - config.errorRate) * 100);
  
  // Calculate productivity improvement
  const productivity = Math.round(config.automationPotential * 100);
  
  // Calculate annual metrics
  const hourlyRate = 35 * config.processingTimeMultiplier;
  const annualSavings = Math.round(
    employeeCount * timeReduction * hourlyRate * config.savingsMultiplier
  );
  
  return {
    automation: {
      timeReduction,
      errorReduction,
      productivity
    },
    annual: {
      savings: annualSavings,
      hours: timeReduction * employeeCount
    }
  };
};