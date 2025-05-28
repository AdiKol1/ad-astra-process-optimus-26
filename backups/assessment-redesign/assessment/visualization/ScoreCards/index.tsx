import React from 'react';
import { useAssessment } from '@/contexts/AssessmentContext';
import { MetricScoreCard } from './score-cards/MetricScoreCard';
import { SectionScoreCard } from './score-cards/SectionScoreCard';
import type { SectionScore, IndustryBenchmark } from '@/types/assessment';

interface ScoreCardsProps {
  overallScore: number;
  sectionScores: {
    process: number;
    marketing: number;
  };
  benchmarks?: Record<string, IndustryBenchmark>;
}

export const ScoreCards: React.FC<ScoreCardsProps> = ({ 
  overallScore, 
  sectionScores, 
  benchmarks 
}) => {
  const { auditState } = useAssessment();
  const { sectionScores: testSectionScores, score: testScore } = auditState?.assessmentData || {};
  const formatScore = (score: number) => `${(score * 100).toFixed(1)}%`;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      <MetricScoreCard
        title="Overall Score"
        value={formatScore(testScore || 0)}
        description="Combined assessment score based on all evaluation areas"
      />

      {Object.entries(testSectionScores || sectionScores).map(([section, data]) => (
        <SectionScoreCard
          key={section}
          title={section}
          score={data * 100}
          benchmark={benchmarks?.[section]}
        />
      ))}
    </div>
  );
};

export default ScoreCards;