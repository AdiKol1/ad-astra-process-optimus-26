const TOOL_SCORES = {
  'Marketing automation platform': 30,
  'CRM system': 25,
  'Analytics tools': 20,
  'Email marketing platform': 15,
  'AI/ML tools': 35,
  'Spreadsheets/Manual tracking': 10 // Added base score for manual tools
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

export const calculateToolMaturity = (tools: string[]): number => {
  console.log('Calculating tool maturity for:', tools);
  const baseScore = tools.reduce((score, tool) => score + (TOOL_SCORES[tool] || 10), 0);
  // Ensure minimum baseline score for any toolset
  return Math.max(Math.min(baseScore, 100), 25);
};

export const calculateProcessAutomationPotential = (processes: string[]): number => {
  return processes.reduce((total, process) => total + (PROCESS_IMPACT_SCORES[process] || 15), 0);
};

export const calculateEfficiencyScore = (
  responses: Record<string, any>,
  standards: any
): number => {
  console.log('Calculating efficiency score with responses:', responses);
  
  const toolMaturity = calculateToolMaturity(responses.toolStack || []);
  
  // Calculate process efficiency based on identified manual processes
  const processAutomationPotential = calculateProcessAutomationPotential(responses.manualProcesses || []);
  const processEfficiency = Math.min(processAutomationPotential, 100);
  
  // Get base automation level
  const baseAutomationLevel = responses.automationLevel ? parseInt(responses.automationLevel) : 25;
  
  // Apply industry-specific multipliers for healthcare
  const industryMultiplier = responses.industry === 'Healthcare' ? 1.2 : 1;
  
  // Calculate weighted score with industry considerations
  const score = Math.round(
    ((toolMaturity * 0.3) +
    (processEfficiency * 0.4) +
    (baseAutomationLevel * 0.3)) * industryMultiplier
  );
  
  console.log('Efficiency score components:', {
    toolMaturity,
    processEfficiency,
    baseAutomationLevel,
    industryMultiplier,
    finalScore: score
  });
  
  // Ensure minimum efficiency score based on manual processes count
  const minimumScore = Math.min(responses.manualProcesses?.length * 10 || 0, 45);
  
  return Math.max(score, minimumScore);
};