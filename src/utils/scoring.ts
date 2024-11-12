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
  let maxScore = 100; // Changed from dynamic to fixed max score
  const recommendations: string[] = [];

  // Calculate score based on section-specific criteria
  switch (sectionId) {
    case 'processDetails':
      // Score based on process volume
      const volumeScores: Record<string, number> = {
        'Less than 100': 20,
        '100-500': 40,
        '501-1000': 60,
        '1001-5000': 80,
        'More than 5000': 100
      };
      score = volumeScores[answers.processVolume] || 0;
      
      // Add employee count factor
      const employees = Number(answers.employees) || 0;
      score += Math.min(employees * 5, 50); // 5 points per employee up to 50 points
      score = Math.min(score, 100); // Cap at 100
      
      if (score > 60) {
        recommendations.push('High automation potential based on volume and team size');
      }
      break;

    case 'technology':
      const systems = answers.currentSystems || [];
      score = Math.min((systems.length / 8) * 100, 100); // Score based on number of systems
      
      if (score < 30) {
        recommendations.push('Consider implementing more digital systems');
      }
      break;

    case 'processes':
      const manualProcesses = answers.manualProcesses || [];
      score = Math.min((manualProcesses.length / 6) * 100, 100);
      
      const timeSpent = Number(answers.timeSpent) || 0;
      score = Math.min(score + (timeSpent / 40) * 100, 100);
      
      if (timeSpent > 20) {
        recommendations.push('High potential for time savings through automation');
      }
      break;

    case 'team':
      const teamSize = Number(answers.teamSize) || 0;
      score = Math.min((teamSize / 10) * 100, 100);
      
      const departments = answers.departments || [];
      score = Math.min(score + (departments.length / 7) * 100, 100);
      score = Math.floor(score / 2); // Average of both factors
      
      if (score > 50) {
        recommendations.push('Team size indicates good automation ROI potential');
      }
      break;

    case 'challenges':
      const painPoints = answers.painPoints || [];
      score = Math.min((painPoints.length / 6) * 100, 100);
      
      if (painPoints.includes('High error rates')) {
        score += 20;
      }
      if (painPoints.includes('Manual data entry')) {
        score += 20;
      }
      score = Math.min(score, 100); // Cap at 100
      break;
  }

  return {
    score,
    maxScore,
    percentage: Math.round(score), // Score is already a percentage
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