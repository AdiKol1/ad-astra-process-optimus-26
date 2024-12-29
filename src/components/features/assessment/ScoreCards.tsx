import React from 'react';
import { useAssessment } from '@/contexts/AssessmentContext';
import { MetricScoreCard } from './score-cards/MetricScoreCard';
import { SectionScoreCard } from './score-cards/SectionScoreCard';
import type { SectionScore, IndustryBenchmark } from '@/contexts/AssessmentContext';

interface ScoreCardsProps {
  overallScore: number;
  sectionScores: {
    process: number;
    marketing: number;
  };
<<<<<<< HEAD
  benchmarks?: Record<string, number>;
}> = ({ overallScore, sectionScores, benchmarks }) => {
  const { assessmentData } = useAssessment();
=======
  benchmarks?: Record<string, IndustryBenchmark>;
}

export const ScoreCards: React.FC<ScoreCardsProps> = ({ 
  overallScore, 
  sectionScores, 
  benchmarks 
}) => {
  const { auditState } = useAssessment();
  const { sectionScores: testSectionScores, score: testScore } = auditState?.assessmentData || {};
>>>>>>> 79d3f1401aad9e8ef80acc2e444faa842719d73b
  const formatScore = (score: number) => `${(score * 100).toFixed(1)}%`;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
<<<<<<< HEAD
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-2">Overall Score</h3>
        <div className="text-3xl font-bold text-blue-600">
          {formatScore(overallScore)}
        </div>
      </Card>

      {Object.entries(sectionScores).map(([section, score]) => (
=======
      <MetricScoreCard
        title="Overall Score"
        value={formatScore(testScore || 0)}
        description="Combined assessment score based on all evaluation areas"
      />

      {Object.entries(testSectionScores || sectionScores).map(([section, data]) => (
>>>>>>> 79d3f1401aad9e8ef80acc2e444faa842719d73b
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

export default ScoreCards;