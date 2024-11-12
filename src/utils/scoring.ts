export interface SectionScore {
  score: number;
  maxScore: number;
  percentage: number;
  recommendations: string[];
}

export interface AssessmentScore {
  overall: number;
  sections: Record<string, SectionScore>;
  automationPotential: number;
}

const SECTION_WEIGHTS = {
  processDetails: 0.2,    // 20% weight
  technology: 0.2,        // 20% weight
  processes: 0.25,        // 25% weight
  team: 0.15,            // 15% weight
  challenges: 0.2         // 20% weight
};

export const calculateSectionScore = (
  sectionId: string,
  answers: Record<string, any>
): SectionScore => {
  let score = 0;
  let maxScore = 100;
  const recommendations: string[] = [];

  switch (sectionId) {
    case 'processDetails':
      // Score based on process volume and employees
      const volumeScores: Record<string, number> = {
        'Less than 100': 40,
        '100-500': 55,
        '501-1000': 70,
        '1001-5000': 85,
        'More than 5000': 100
      };
      score = volumeScores[answers.processVolume] || 50;
      
      // Add employee count factor
      const employees = Number(answers.employees) || 0;
      if (employees > 0) {
        score += Math.min(employees * 2, 30); // Up to 30 additional points based on team size
      }
      break;

    case 'technology':
      // Score based on current systems and integration
      const systems = answers.currentSystems || [];
      score = Math.min((systems.length / 5) * 100, 100); // 20 points per system
      if (score < 40) score = 40; // Minimum baseline score
      break;

    case 'processes':
      // Score based on manual processes and time spent
      const manualProcesses = answers.manualProcesses || [];
      const processScore = Math.min((manualProcesses.length / 4) * 100, 100);
      
      const timeSpent = Number(answers.timeSpent) || 0;
      const timeScore = Math.min((timeSpent / 20) * 100, 100);
      
      score = Math.round((processScore + timeScore) / 2);
      if (score < 35) score = 35; // Minimum baseline score
      break;

    case 'team':
      // Score based on team size and departments
      const teamSize = Number(answers.teamSize) || 1;
      const teamScore = Math.min((teamSize / 5) * 100, 100);
      
      const departments = answers.departments || [];
      const deptScore = Math.min((departments.length / 4) * 100, 100);
      
      score = Math.round((teamScore + deptScore) / 2);
      if (score < 30) score = 30; // Minimum baseline score
      break;

    case 'challenges':
      // Score based on pain points and challenges
      const painPoints = answers.painPoints || [];
      score = Math.min((painPoints.length / 3) * 100, 100);
      
      if (painPoints.includes('High error rates')) score += 10;
      if (painPoints.includes('Manual data entry')) score += 10;
      if (painPoints.includes('Time-consuming processes')) score += 10;
      
      score = Math.min(score, 100);
      if (score < 45) score = 45; // Minimum baseline score
      break;
  }

  return {
    score,
    maxScore,
    percentage: Math.round(score),
    recommendations
  };
};

export const calculateAssessmentScore = (
  answers: Record<string, any>
): AssessmentScore => {
  const sectionScores: Record<string, SectionScore> = {};
  let weightedTotal = 0;

  // Calculate scores for each section
  Object.keys(SECTION_WEIGHTS).forEach(sectionId => {
    const sectionScore = calculateSectionScore(sectionId, answers);
    sectionScores[sectionId] = sectionScore;
    weightedTotal += (sectionScore.percentage * SECTION_WEIGHTS[sectionId]);
  });

  // Calculate automation potential based on overall score and additional factors
  const automationPotential = Math.min(
    Math.round(weightedTotal * 1.2), // Adjust potential slightly higher than raw score
    100 // Cap at 100%
  );

  return {
    overall: Math.round(weightedTotal),
    sections: sectionScores,
    automationPotential
  };
};
