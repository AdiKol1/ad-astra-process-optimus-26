interface QualificationScore {
  score: number;
  qualificationLevel: 'high' | 'medium' | 'low';
  nextSteps: string[];
  estimatedValue: {
    timeSavings: number;
    costSavings: number;
    roi: number;
  };
}

export const calculateQualificationScore = (responses: Record<string, any>): QualificationScore => {
  let score = 0;
  const nextSteps: string[] = [];

  // Role scoring
  if (responses.role === 'Business Owner/CEO' || responses.role === 'Operations Manager') {
    score += 30;
  } else if (responses.role === 'Department Head' || responses.role === 'Process Manager') {
    score += 20;
  } else {
    score += 10;
  }

  // Pain points scoring
  const painPoints = responses.painPoints || [];
  score += Math.min(painPoints.length * 10, 30);

  // Urgency scoring
  if (responses.urgency?.includes('Critical')) {
    score += 20;
  } else if (responses.urgency?.includes('Important')) {
    score += 15;
  } else if (responses.urgency?.includes('Moderate')) {
    score += 10;
  }

  // Decision making authority
  if (responses.decisionMaking === 'Final decision maker') {
    score += 20;
  } else if (responses.decisionMaking === 'Key influencer') {
    score += 15;
  }

  // Calculate estimated value
  const timeWasted = responses.timeWasted || '0';
  const hoursPerWeek = timeWasted.includes('More than 40') ? 50 : 
                       timeWasted.includes('20-40') ? 30 :
                       timeWasted.includes('10-20') ? 15 : 5;

  const teamSize = responses.teamSize || '1-5';
  const employeeCount = teamSize.includes('More than 50') ? 75 :
                       teamSize.includes('21-50') ? 35 :
                       teamSize.includes('6-20') ? 13 : 3;

  const timeSavings = hoursPerWeek * employeeCount * 52;
  const costSavings = timeSavings * 50; // Assuming $50/hour average cost
  const roi = (costSavings * 0.6) - (costSavings * 0.2); // 60% of savings minus 20% implementation cost

  // Determine qualification level and next steps
  const qualificationLevel = score >= 80 ? 'high' : score >= 60 ? 'medium' : 'low';
  
  if (qualificationLevel === 'high') {
    nextSteps.push(
      'Schedule a detailed process analysis call',
      'Prepare custom ROI calculation',
      'Share relevant case studies'
    );
  } else if (qualificationLevel === 'medium') {
    nextSteps.push(
      'Book an initial consultation',
      'Share educational resources',
      'Provide high-level ROI estimate'
    );
  } else {
    nextSteps.push(
      'Download our process optimization guide',
      'Subscribe to our newsletter',
      'Explore self-service options'
    );
  }

  return {
    score,
    qualificationLevel,
    nextSteps,
    estimatedValue: {
      timeSavings,
      costSavings,
      roi
    }
  };
};