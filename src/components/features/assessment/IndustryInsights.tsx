import React, { useMemo } from 'react';
import { useAssessment } from '@/contexts/assessment/AssessmentContext';
import { calculateAutomationScore, calculateEfficiencyScore, getIndustryBenchmarks } from '@/utils/assessment';
import { ErrorBoundary } from '@/components/error/ErrorBoundary';

export const IndustryInsights: React.FC = React.memo(() => {
  const { assessmentData } = useAssessment();

  const insightData = useMemo(() => {
    if (!assessmentData?.responses) return null;

    const {
      industry = 'Technology',
      processComplexity = 'Medium',
      manualProcesses = [],
    } = assessmentData.responses;

    const automationScore = calculateAutomationScore(manualProcesses);
    const efficiencyScore = calculateEfficiencyScore(processComplexity);
    const { automationBenchmark, efficiencyBenchmark } = getIndustryBenchmarks(industry);
    
    return {
      metrics: [
        {
          metric: 'Process Automation',
          industry: `${automationScore}%`,
          benchmark: automationBenchmark
        },
        {
          metric: 'Efficiency Score',
          industry: efficiencyScore,
          benchmark: efficiencyBenchmark
        }
      ]
    };
  }, [assessmentData?.responses]);

  if (!insightData) return null;

  const InsightsContent = () => (
    <div className="bg-white shadow-lg rounded-lg p-6 my-4">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        Industry Insights
      </h3>
      <div className="space-y-6">
        {insightData.metrics.map((item, index) => (
          <div key={index} className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-900">{item.metric}</p>
              <p className="text-xs text-gray-500">Industry benchmark: {item.benchmark}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold text-blue-600">{item.industry}</p>
              <p className="text-xs text-gray-500">Your score</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <ErrorBoundary>
      <InsightsContent />
    </ErrorBoundary>
  );
});