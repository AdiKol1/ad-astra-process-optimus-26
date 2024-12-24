import React from 'react';
import { DetailedScoreCard } from './score-cards/DetailedScoreCard';
import { SavingsCard } from './score-cards/SavingsCard';
import { EfficiencyCard } from './score-cards/EfficiencyCard';
import { MetricScoreCard } from './score-cards/MetricScoreCard';
import type { SectionScore, IndustryBenchmark } from '@/contexts/AssessmentContext';

interface ScoreCardsProps {
  overallScore: number;
  sectionScores: {
    process: number;
    marketing: number;
  };
  benchmarks?: Record<string, number>;
}> = ({ overallScore, sectionScores, benchmarks }) => {
  const { assessmentData } = useAssessment();
  const formatScore = (score: number) => `${(score * 100).toFixed(1)}%`;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-2">Overall Score</h3>
        <div className="text-3xl font-bold text-blue-600">
          {formatScore(overallScore)}
        </div>
      </Card>

      {Object.entries(sectionScores).map(([section, score]) => (
        <SectionScoreCard
          key={section}
          title={section}
          score={score * 100}
          benchmark={benchmarks?.[section]}
        />
      ))}
    </div>
  );
};

export { SavingsCard, EfficiencyCard };