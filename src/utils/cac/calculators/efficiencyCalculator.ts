import { IndustryStandard } from '../industryStandards';

const TOOL_SCORES = {
  'Marketing automation platform': 30,
  'CRM system': 25,
  'Analytics tools': 20,
  'Email marketing platform': 15,
  'AI/ML tools': 35,
  'Spreadsheets/Manual tracking': 10
};

const PROCESS_IMPACT_SCORES = {
  'Data Entry': 15,
  'Document Processing': 20,
  'Customer Communication': 15,
  'Reporting': 10,
  'Invoice Processing': 20,
  'Scheduling': 15,
  'Approval Workflows': 20
};

export const calculateEfficiencyScore = (
  responses: Record<string, any>,
  standards: IndustryStandard
): number => {
  console.log('Calculating efficiency score with responses:', responses);
  
  // Calculate current automation level
  const automationLevelStr = responses.automationLevel || '0-25%';
  const currentAutomation = parseInt(automationLevelStr.split('-')[1] || '25') / 100;
  
  // Calculate potential improvement (inverse of current automation)
  const automationPotential = 1 - currentAutomation;
  
  // Calculate tool maturity
  const toolStack = responses.toolStack || [];
  const toolMaturity = calculateToolMaturity(toolStack);
  const toolPotential = (100 - toolMaturity) / 100; // Inverse of maturity = potential
  
  // Calculate process automation potential
  const processes = responses.manualProcesses || [];
  const processAutomationPotential = calculateProcessAutomationPotential(processes);
  
  // Weight the factors
  const weightedScore = (
    (automationPotential * 0.4) +
    (toolPotential * 0.3) +
    (processAutomationPotential * 0.3)
  );
  
  // Apply industry multiplier
  const industryMultiplier = responses.industry === 'Healthcare' ? 1.2 : 1;
  const finalScore = Math.min(weightedScore * industryMultiplier, 0.85);
  
  console.log('Efficiency calculation components:', {
    automationPotential,
    toolPotential,
    processAutomationPotential,
    weightedScore,
    finalScore
  });
  
  return finalScore;
};

const calculateToolMaturity = (tools: string[]): number => {
  const score = tools.reduce((acc, tool) => acc + (TOOL_SCORES[tool] || 10), 0);
  return Math.min(score, 100);
};

const calculateProcessAutomationPotential = (processes: string[]): number => {
  const potentialScore = processes.reduce((total, process) => 
    total + (PROCESS_IMPACT_SCORES[process] || 15), 0
  );
  return Math.min(potentialScore / 100, 0.85);
};