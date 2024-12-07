const TOOL_SCORES = {
  'Marketing automation platform': 30,
  'CRM system': 25,
  'Analytics tools': 20,
  'Email marketing platform': 15,
  'AI/ML tools': 35
};

export const calculateToolMaturity = (tools: string[]): number => {
  console.log('Calculating tool maturity for:', tools);
  return Math.min(
    tools.reduce((score, tool) => score + (TOOL_SCORES[tool] || 10), 0),
    100
  );
};

export const calculateEfficiencyScore = (
  responses: Record<string, any>,
  standards: any
): number => {
  console.log('Calculating efficiency score with responses:', responses);
  
  const toolMaturity = calculateToolMaturity(responses.toolStack || []);
  const processEfficiency = 100 - ((responses.manualProcesses?.length || 0) * 15);
  const automationImpact = responses.automationLevel ? parseInt(responses.automationLevel) : 25;
  
  const score = Math.round(
    (toolMaturity * 0.4) +
    (processEfficiency * 0.35) +
    (automationImpact * 0.25)
  );
  
  console.log('Efficiency score components:', {
    toolMaturity,
    processEfficiency,
    automationImpact,
    finalScore: score
  });
  
  return score;
};