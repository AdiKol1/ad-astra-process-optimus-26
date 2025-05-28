import React from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useAssessmentStore } from '@/stores/assessment';
import type { AssessmentResults } from '@/types/assessment/state';

interface CategoryScore {
  label: string;
  score: number;
}

export const ResultsVisualization: React.FC = () => {
  const { results } = useAssessmentStore();

  if (!results) {
    return null;
  }

  const { scores } = results as AssessmentResults;
  
  const categoryScores: CategoryScore[] = [
    { label: 'Process Maturity', score: scores.processScore },
    { label: 'Technology Readiness', score: scores.technologyScore },
    { label: 'Team Capability', score: scores.teamScore }
  ];

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">Assessment Results</h3>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Overall Score</span>
              <span className="text-sm font-medium">{scores.totalScore}%</span>
            </div>
            <Progress value={scores.totalScore} />
          </div>

          {categoryScores.map(({ label, score }) => (
            <div key={label}>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">{label}</span>
                <span className="text-sm font-medium">{score}%</span>
              </div>
              <Progress value={score} />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}; 