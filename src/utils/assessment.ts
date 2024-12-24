export const calculateAutomationScore = (manualProcesses: string[]): number => {
  return Math.max(20, 100 - (manualProcesses.length * 15));
};

export const calculateEfficiencyScore = (processComplexity: string): string => {
  const scores = {
    Low: '90%',
    Medium: '75%',
    High: '60%',
  };
  return scores[processComplexity as keyof typeof scores] || '75%';
};

export const getIndustryBenchmarks = (industry: string) => {
  // This could be expanded to include real industry-specific benchmarks
  const defaultBenchmarks = {
    automationBenchmark: '85%',
    efficiencyBenchmark: '80%',
  };

  // Add industry-specific logic here if needed
  return defaultBenchmarks;
};
