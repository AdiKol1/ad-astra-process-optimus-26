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
  let maxScore = 0;
  const recommendations: string[] = [];

  // Calculate score based on section-specific criteria
  switch (sectionId) {
    case 'processDetails':
      // Score based on number of employees and process volume
      const employees = Number(answers.employees) || 0;
      // More employees = higher automation potential (up to 10 points)
      score += employees > 10 ? 10 : employees;
      maxScore += 10;

      // Score based on process volume (higher volume = higher automation potential)
      const volumeScores: Record<string, number> = {
        'Less than 100': 2,      // Low volume
        '100-500': 4,            // Medium-low volume
        '501-1000': 6,           // Medium volume
        '1001-5000': 8,          // Medium-high volume
        'More than 5000': 10     // High volume
      };
      score += volumeScores[answers.processVolume] || 0;
      maxScore += 10;

      if (employees > 5) {
        recommendations.push('Consider team-wide automation solutions');
      }
      if (volumeScores[answers.processVolume] > 6) {
        recommendations.push('High volume indicates strong automation potential');
      }
      break;

    case 'technology':
      // Score based on current systems and integration needs
      const systems = answers.currentSystems || [];
      // More modern systems = better automation readiness (2 points per system)
      score += systems.length * 2;
      maxScore += 16; // Maximum 8 systems

      // Integration needs indicate automation opportunities
      const integrations = answers.integrationNeeds || [];
      score += integrations.length * 2;
      maxScore += 12; // Maximum 6 integrations

      if (systems.includes('Paper-based')) {
        recommendations.push('Prioritize digital transformation');
      }
      if (integrations.length > 2) {
        recommendations.push('Multiple integration points indicate automation opportunities');
      }
      break;

    case 'processes':
      // Score based on manual processes and time spent
      const manualProcesses = answers.manualProcesses || [];
      // More manual processes = higher automation potential
      score += manualProcesses.length * 2;
      maxScore += 12;

      // Time spent on manual processes
      const timeSpent = Number(answers.timeSpent) || 0;
      score += timeSpent > 40 ? 10 : Math.floor(timeSpent / 4);
      maxScore += 10;

      if (timeSpent > 20) {
        recommendations.push('High potential for time savings through automation');
      }
      if (manualProcesses.length > 3) {
        recommendations.push('Multiple manual processes identified for automation');
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
      if (teamSize > 5) {
        recommendations.push('Team size suggests good automation ROI potential');
      }
      break;

    case 'challenges':
      // Score based on pain points and priorities
      const painPoints = answers.painPoints || [];
      score += painPoints.length * 2;
      maxScore += 12;

      if (painPoints.includes('High error rates')) {
        recommendations.push('Focus on error reduction through automation');
        score += 2;
      }
      if (painPoints.includes('Manual data entry')) {
        recommendations.push('Data entry automation recommended');
        score += 2;
      }
      break;
  }

  const percentage = Math.round((score / maxScore) * 100);

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