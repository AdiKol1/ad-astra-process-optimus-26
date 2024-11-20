import React from 'react';
import { Card } from '@/components/ui/card';
import type { AssessmentData, SectionScore } from '../types';

interface DetailedAnalysisProps {
  assessmentData: AssessmentData;
  sectionScores: Record<string, SectionScore>;
}

const DetailedAnalysis: React.FC<DetailedAnalysisProps> = ({
  assessmentData,
  sectionScores,
}) => {
  const getSectionAnalysis = (section: string, score: SectionScore) => {
    const strengthThreshold = 0.7;
    const weaknessThreshold = 0.4;

    const analysis = {
      strengths: [] as string[],
      weaknesses: [] as string[],
      recommendations: [] as string[],
    };

    if (score.score >= strengthThreshold) {
      analysis.strengths.push(`Strong ${section} management practices`);
    } else if (score.score <= weaknessThreshold) {
      analysis.weaknesses.push(`${section} processes need improvement`);
      analysis.recommendations.push(`Consider implementing automated ${section} workflows`);
    }

    return analysis;
  };

  return (
    <Card className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Detailed Analysis</h2>
      {Object.entries(sectionScores).map(([section, score]) => {
        const analysis = getSectionAnalysis(section, score);
        return (
          <div key={section} className="space-y-4">
            <h3 className="text-xl font-semibold capitalize">{section} Analysis</h3>
            
            {analysis.strengths.length > 0 && (
              <div>
                <h4 className="text-lg font-medium text-green-700">Strengths</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {analysis.strengths.map((strength, index) => (
                    <li key={index} className="text-gray-600">{strength}</li>
                  ))}
                </ul>
              </div>
            )}

            {analysis.weaknesses.length > 0 && (
              <div>
                <h4 className="text-lg font-medium text-red-700">Areas for Improvement</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {analysis.weaknesses.map((weakness, index) => (
                    <li key={index} className="text-gray-600">{weakness}</li>
                  ))}
                </ul>
              </div>
            )}

            {analysis.recommendations.length > 0 && (
              <div>
                <h4 className="text-lg font-medium text-blue-700">Recommendations</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {analysis.recommendations.map((recommendation, index) => (
                    <li key={index} className="text-gray-600">{recommendation}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );
      })}
    </Card>
  );
};

export default DetailedAnalysis;
