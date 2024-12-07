export const calculateTeamSizeMultiplier = (teamSize: string): number => {
  const sizes = {
    '1-5': 0.9,
    '6-20': 1.2,
    '21-50': 1.4,
    'More than 50': 1.5
  };
  return sizes[teamSize] || 1;
};

export const calculateImplementationCost = (responses: Record<string, any>): number => {
  console.log('Calculating implementation cost for:', responses);
  
  const baseImplementationCost = 25000;
  const complexityMultiplier = responses.manualProcesses?.length > 4 ? 1.4 : 1;
  const teamSizeMultiplier = calculateTeamSizeMultiplier(responses.teamSize?.[0]);
  
  const cost = Math.round(baseImplementationCost * complexityMultiplier * teamSizeMultiplier);
  console.log('Implementation cost details:', { complexityMultiplier, teamSizeMultiplier, finalCost: cost });
  
  return cost;
};

export const calculateCurrentCAC = (
  responses: Record<string, any>,
  standards: any
): number => {
  console.log('Calculating current CAC with:', { responses, standards });
  
  const baseCAC = standards.baseCAC;
  const processMultiplier = Math.min((responses.manualProcesses?.length || 1) * 0.2, 0.8); // Increased cap to 0.8
  const teamSizeMultiplier = calculateTeamSizeMultiplier(responses.teamSize?.[0]);
  const toolEfficiency = responses.toolStack?.includes('Marketing automation platform') ? 0.9 : 1.2;
  
  const cac = Math.round(baseCAC * (1 + processMultiplier) * teamSizeMultiplier * toolEfficiency);
  console.log('CAC calculation details:', { processMultiplier, teamSizeMultiplier, toolEfficiency, finalCAC: cac });
  
  return cac;
};