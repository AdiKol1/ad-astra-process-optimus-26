export interface RecommendationTemplate {
  id: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  timeframe: 'immediate' | 'short-term' | 'long-term';
  benefits: string[];
  requirements?: string[];
}

export const automationTemplates: Record<string, RecommendationTemplate> = {
  dataEntry: {
    id: 'data-entry',
    title: "Data Entry Automation",
    description: "Implement automated data capture and validation systems to reduce manual data entry.",
    impact: 'high',
    timeframe: 'short-term',
    benefits: [
      "Reduce manual effort by up to 80%",
      "Minimize data entry errors",
      "Accelerate processing time",
      "Improve data accuracy"
    ],
    requirements: [
      "Document scanning capability",
      "OCR technology integration",
      "Data validation rules"
    ]
  },
  processOptimization: {
    id: 'process-optimization',
    title: "Process Workflow Optimization",
    description: "Streamline existing workflows through automation and parallel processing.",
    impact: 'high',
    timeframe: 'immediate',
    benefits: [
      "Reduce processing time by 50%",
      "Eliminate bottlenecks",
      "Improve resource utilization",
      "Enhanced tracking and reporting"
    ]
  },
  qualityControl: {
    id: 'quality-control',
    title: "Automated Quality Assurance",
    description: "Implement automated validation rules and quality control checks.",
    impact: 'medium',
    timeframe: 'short-term',
    benefits: [
      "Reduce error rates by up to 90%",
      "Consistent quality standards",
      "Real-time error detection",
      "Improved compliance"
    ]
  },
  integration: {
    id: 'system-integration',
    title: "System Integration Automation",
    description: "Automate data flow between different systems and applications.",
    impact: 'high',
    timeframe: 'long-term',
    benefits: [
      "Eliminate manual data transfer",
      "Real-time data synchronization",
      "Reduced operational costs",
      "Improved data consistency"
    ],
    requirements: [
      "API availability",
      "Data mapping documentation",
      "Security protocols"
    ]
  }
};

export const getRecommendationsByScore = (score: number): RecommendationTemplate[] => {
  const recommendations: RecommendationTemplate[] = [];
  
  if (score >= 80) {
    recommendations.push(automationTemplates.integration);
    recommendations.push(automationTemplates.processOptimization);
  } else if (score >= 60) {
    recommendations.push(automationTemplates.dataEntry);
    recommendations.push(automationTemplates.qualityControl);
  } else {
    recommendations.push(automationTemplates.processOptimization);
  }
  
  return recommendations;
};