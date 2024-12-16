import React from 'react';
import { useAssessment } from '@/contexts/AssessmentContext';
import { MetricScoreCard } from './score-cards/MetricScoreCard';
import { DetailedScoreCard } from './score-cards/DetailedScoreCard';

export interface ScoreCardsProps {
  overallScore: number;
  sectionScores: {
    process: any;
    communication: any;
    automation: any;
  };
  benchmarks?: Record<string, any>;
}

export const ScoreCards: React.FC<ScoreCardsProps> = ({ 
  overallScore, 
  sectionScores, 
  benchmarks 
}) => {
  const { auditState } = useAssessment();
  const { sectionScores: testSectionScores, score: testScore } = auditState?.assessmentData || {};

  const formatScore = (score: number) => `${(score * 100).toFixed(1)}`;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      <MetricScoreCard
        title="Overall Score"
        value={formatScore(testScore || 0)}
        description="Combined score from all assessment sections"
      />

      {Object.entries(testSectionScores || sectionScores).map(([section, data]) => (
        <DetailedScoreCard
          key={section}
          title={section}
          score={data.score * 100}
          benchmark={benchmarks?.[section]}
        />
      ))}
    </div>
  );
};

// Export test data for development
export const testAssessmentData = {
  responses: {
    teamSize: 25,
    departments: ['Operations', 'Finance', 'IT', 'Management'],
    roleBreakdown: {
      'Manager': 3,
      'Analyst': 12,
      'Support': 10
    },
    hoursPerWeek: 35,
    manualProcesses: ['Data Entry', 'Report Generation', 'Invoice Processing'],
    processTime: 20,
    errorRate: '3-5%',
    bottlenecks: ['Manual Data Entry', 'Approval Process'],
    currentSystems: ['CRM', 'ERP', 'Document Management'],
    integrationNeeds: ['API Integration', 'Data Sync'],
    dataAccess: ['Automated sync', 'File exports/imports'],
    painPoints: ['Slow Processing', 'Data Errors', 'Manual Work'],
    priority: 'Speed up processing time',
    objectives: ['Reduce Processing Time', 'Improve Accuracy', 'Automate Workflows'],
    expectedOutcomes: ['50% Faster Processing', 'Near-zero Errors', 'Staff Time Savings'],
    monthlyBudget: '$1,001-$5,000',
    timeline: '1-3 months'
  },
  currentStep: 6,
  totalSteps: 6
};