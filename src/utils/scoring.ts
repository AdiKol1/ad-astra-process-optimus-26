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
  processDetails: 0.2,
  technology: 0.2,
  processes: 0.25,
  team: 0.15,
  challenges: 0.2
};

export const calculateSectionScore = (
  sectionId: string,
  answers: Record<string, any>
): SectionScore => {
  let score = 0;
  let maxScore = 0;
  const recommendations: string[] = [];

  // Calculate score based on section-specific criteria
  switch (sectionId) {
    case 'processDetails':
      // Score based on number of employees and process volume
      const employees = Number(answers.employees) || 0;
      score += employees > 10 ? 10 : employees;
      maxScore += 10;

      const volumeScores: Record<string, number> = {
        'Less than 100': 2,
        '100-500': 4,
        '501-1000': 6,
        '1001-5000': 8,
        'More than 5000': 10
      };
      score += volumeScores[answers.processVolume] || 0;
      maxScore += 10;

      if (employees > 5) {
        recommendations.push('Consider team-wide automation solutions');
      }
      break;

    case 'technology':
      // Score based on current systems and integration needs
      const systems = answers.currentSystems || [];
      score += systems.length * 2;
      maxScore += 16; // Maximum 8 systems

      const integrations = answers.integrationNeeds || [];
      score += integrations.length * 2;
      maxScore += 12; // Maximum 6 integrations

      if (systems.includes('Paper-based')) {
        recommendations.push('Prioritize digital transformation');
      }
      break;

    case 'processes':
      // Score based on manual processes and time spent
      const manualProcesses = answers.manualProcesses || [];
      score += manualProcesses.length * 2;
      maxScore += 12;

      const timeSpent = Number(answers.timeSpent) || 0;
      score += timeSpent > 40 ? 10 : Math.floor(timeSpent / 4);
      maxScore += 10;

      if (timeSpent > 20) {
        recommendations.push('High potential for time savings through automation');
      }
      break;

    case 'team':
      // Score based on team size and department involvement
      const teamSize = Number(answers.teamSize) || 0;
      score += teamSize > 10 ? 10 : teamSize;
      maxScore += 10;

      const departments = answers.departments || [];
      score += departments.length * 2;
      maxScore += 14; // Maximum 7 departments

      if (departments.length > 3) {
        recommendations.push('Consider cross-departmental automation strategy');
      }
      break;

    case 'challenges':
      // Score based on pain points and priorities
      const painPoints = answers.painPoints || [];
      score += painPoints.length * 2;
      maxScore += 12;

      if (painPoints.includes('High error rates')) {
        recommendations.push('Focus on error reduction through automation');
      }
      break;
  }

  const percentage = (score / maxScore) * 100;

  return {
    score,
    maxScore,
    percentage,
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

  // Calculate automation potential based on overall score
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