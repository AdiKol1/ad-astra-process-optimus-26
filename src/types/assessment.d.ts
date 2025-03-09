export interface AssessmentResponses {
  toolStack: string;
  industry: string;
  manualProcesses: string[];
  automationLevel: string;
  marketingBudget: string;
  userInfo?: {
    industry?: string;
  };
} 