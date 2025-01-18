import { AssessmentResponses } from '@/types/assessment';

export const createMockAssessmentResponse = (overrides?: Partial<AssessmentResponses>): AssessmentResponses => {
  const defaultResponses: AssessmentResponses = {
    // Team Questions
    teamSize: '10-50',
    teamExpertise: ['project-management', 'process-optimization'],
    teamChallenges: ['manual-work', 'communication'],
    
    // Qualifying Questions
    industry: 'technology',
    companySize: '50-200',
    annualRevenue: '1M-5M',
    
    // Impact Questions
    currentChallenges: ['efficiency', 'scalability'],
    businessGoals: ['reduce-costs', 'improve-quality'],
    expectedImpact: 'significant',
    
    // Readiness Questions
    techStack: ['excel', 'email', 'crm'],
    dataSource: ['spreadsheets', 'databases'],
    integrationNeeds: ['medium'],
    
    // Process Questions
    manualProcesses: ['Data Entry', 'Document Processing'],
    timeSpent: '40-60 hours',
    bottlenecks: ['Manual Data Entry', 'Communication Delays'],
    processVolume: '1000-5000',
    errorRate: '5-15%',
    
    // Marketing Questions
    marketingTools: ['email-marketing', 'social-media'],
    marketingChallenges: ['lead-generation', 'campaign-management'],
    marketingBudget: '50000-100000',
    marketingGoals: ['increase-leads', 'improve-roi']
  };

  return {
    ...defaultResponses,
    ...overrides
  };
};

export const mockValidationError = {
  questionId: 'timeSpent',
  message: 'Time spent is required'
};

export const mockCalculationResult = {
  savings: {
    annual: 120000,
    monthly: 10000
  },
  metrics: {
    efficiency: 60,
    roi: 250,
    automationLevel: 75,
    paybackPeriodMonths: 4
  },
  costs: {
    current: 200000,
    projected: 80000,
    breakdown: {
      labor: { current: 150000, projected: 60000 },
      tools: { current: 20000, projected: 10000 },
      overhead: { current: 30000, projected: 10000 }
    }
  },
  recommendations: [
    {
      title: 'Process Automation',
      description: 'Implement automation for data entry and document processing',
      impact: 'High',
      timeframe: '3-6 months',
      roi: '250%'
    },
    {
      title: 'Team Optimization',
      description: 'Streamline communication and workflow processes',
      impact: 'Medium',
      timeframe: '1-3 months',
      roi: '150%'
    }
  ]
};
