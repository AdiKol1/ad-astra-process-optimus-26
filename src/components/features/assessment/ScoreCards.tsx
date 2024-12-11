import React from 'react';
import { useAssessment } from '@/contexts/AssessmentContext';
import { Card } from '@/components/ui/card';
import { SavingsCard } from './score-cards/SavingsCard';
import { EfficiencyCard } from './score-cards/EfficiencyCard';
import { SectionScoreCard } from './score-cards/SectionScoreCard';

export const ScoreCards: React.FC<{
  overallScore: number;
  sectionScores: {
    process: any;
    communication: any;
    automation: any;
  };
  benchmarks?: Record<string, any>;
}> = ({ overallScore, sectionScores, benchmarks }) => {
  const { auditState } = useAssessment();
  const { sectionScores: testSectionScores, score: testScore } = auditState?.assessmentData || {};

  const formatScore = (score: number) => `${(score * 100).toFixed(1)}%`;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-2">Overall Score</h3>
        <div className="text-3xl font-bold text-blue-600">{formatScore(testScore || 0)}</div>
      </Card>

      {Object.entries(testSectionScores || sectionScores).map(([section, data]) => (
        <SectionScoreCard
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
