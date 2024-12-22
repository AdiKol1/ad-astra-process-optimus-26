import React from 'react';
import { DetailedScoreCard } from './score-cards/DetailedScoreCard';
import { SavingsCard } from './score-cards/SavingsCard';
import { EfficiencyCard } from './score-cards/EfficiencyCard';
import { MetricScoreCard } from './score-cards/MetricScoreCard';
import type { SectionScore, IndustryBenchmark } from '@/contexts/AssessmentContext';

interface ScoreCardsProps {
  overallScore: number;
  sectionScores: {
    process: SectionScore;
    communication: SectionScore;
    automation: SectionScore;
  };
  benchmarks?: Record<string, IndustryBenchmark>;
}

export const ScoreCards: React.FC<ScoreCardsProps> = ({ 
  overallScore, 
  sectionScores, 
  benchmarks 
}) => {
  const formatScore = (score: number) => `${(score * 100).toFixed(1)}%`;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      <MetricScoreCard
        title="Overall Score"
        value={overallScore}
        tooltipContent="Combined score based on all assessment areas"
      />

      {Object.entries(sectionScores).map(([section, data]) => (
        <DetailedScoreCard
          key={section}
          title={section}
          score={data.score}
          benchmark={benchmarks?.[section]}
        />
      ))}
    </div>
  );
};

export { SavingsCard, EfficiencyCard };