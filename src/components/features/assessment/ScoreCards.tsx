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