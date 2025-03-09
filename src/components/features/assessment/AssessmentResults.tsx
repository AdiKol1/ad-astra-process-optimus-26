import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { AssessmentResults as AssessmentResultsType } from '@/types/assessment/state';

export interface AssessmentResultsProps {
  results: AssessmentResultsType;
}

export const AssessmentResults: React.FC<AssessmentResultsProps> = ({ results }) => {
  const { scores, recommendations } = results;
  const { totalScore, processScore, technologyScore, teamScore } = scores;

  return (
    <div className="space-y-8">
      {/* Overview Section */}
      <Card>
        <CardHeader>
          <CardTitle>Assessment Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Based on our assessment, your organization shows potential for optimization 
            across process, technology, and team dimensions.
          </p>
        </CardContent>
      </Card>

      {/* Metrics Section */}
      <Card>
        <CardHeader>
          <CardTitle>Key Metrics</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-4">
          <div>
            <h3 className="font-semibold mb-2">Overall Score</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Total Optimization Score</span>
                <span>{totalScore}%</span>
              </div>
              <Progress value={totalScore} />
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Process Score</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Process Efficiency</span>
                <span>{processScore}%</span>
              </div>
              <Progress value={processScore} />
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Technology Score</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Technology Utilization</span>
                <span>{technologyScore}%</span>
              </div>
              <Progress value={technologyScore} />
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Team Score</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Team Effectiveness</span>
                <span>{teamScore}%</span>
              </div>
              <Progress value={teamScore} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations Section */}
      <Card>
        <CardHeader>
          <CardTitle>Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            {recommendations.map((rec, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{rec.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">{rec.description}</p>
                  <div className="flex justify-between text-sm">
                    <span>Area: <span className="font-semibold">{rec.area}</span></span>
                    <span>Priority: <span className="font-semibold">{rec.priority}</span></span>
                  </div>
                  <div className="mt-2 text-sm flex justify-between">
                    <span>Impact: <span className={`font-semibold text-${rec.impact}`}>{rec.impact}</span></span>
                    <span>Effort: <span className={`font-semibold text-${rec.effort}`}>{rec.effort}</span></span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};