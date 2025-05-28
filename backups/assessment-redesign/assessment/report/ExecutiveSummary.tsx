import React from 'react';
import { Card } from '@/components/ui/card';
import type { AssessmentData, SectionScore } from '../types';

interface ExecutiveSummaryProps {
  assessmentData: AssessmentData;
  sectionScores: Record<string, SectionScore>;
}

const ExecutiveSummary: React.FC<ExecutiveSummaryProps> = ({
  assessmentData,
  sectionScores,
}) => {
  const calculateOverallScore = () => {
    const scores = Object.values(sectionScores);
    if (!scores.length) return 0;
    return scores.reduce((acc, curr) => acc + (curr.score || 0), 0) / scores.length;
  };

  const getKeyFindings = () => {
    const findings = [];
    const overallScore = calculateOverallScore();

    if (overallScore < 0.4) {
      findings.push('Significant opportunity for process optimization');
    } else if (overallScore < 0.7) {
      findings.push('Moderate automation potential identified');
    } else {
      findings.push('Advanced process maturity detected');
    }

    return findings;
  };

  return (
    <Card className="p-6 space-y-4">
      <h2 className="text-2xl font-bold">Executive Summary</h2>
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">Overall Assessment</h3>
          <p className="text-gray-600">
            Based on your responses, your organization shows a
            {calculateOverallScore() < 0.4 ? ' significant ' : 
             calculateOverallScore() < 0.7 ? ' moderate ' : ' high '}
            potential for process optimization.
          </p>
        </div>
        <div>
          <h3 className="text-lg font-semibold">Key Findings</h3>
          <ul className="list-disc pl-5 space-y-2">
            {getKeyFindings().map((finding, index) => (
              <li key={index} className="text-gray-600">{finding}</li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  );
};

export default ExecutiveSummary;
