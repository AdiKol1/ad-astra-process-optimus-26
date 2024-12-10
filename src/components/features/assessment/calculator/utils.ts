export const calculateWeightedScore = (sections: Record<string, { score: number; weight: number }>): number => {
  const weightedScore = Object.values(sections).reduce((total, { score, weight }) => 
    total + (score * weight), 0
  );
  
  // Ensure score is between 0 and 1
  return Math.max(0, Math.min(1, weightedScore));
};

export const calculateErrorScore = (errorRate: string): number => {
  const scores: Record<string, number> = {
    'Less than 1%': 0.95,
    '1-2%': 0.85,
    '3-5%': 0.7,
    '6-10%': 0.5,
    'More than 10%': 0.3,
    'Not tracked': 0.4
  };
  return scores[errorRate] || 0.4;
};