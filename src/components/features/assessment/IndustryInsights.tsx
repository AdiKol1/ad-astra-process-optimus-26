import React, { useMemo } from 'react';
import { useAssessment } from '@/contexts/assessment/AssessmentContext';

export const IndustryInsights: React.FC = React.memo(() => {
  const { assessmentData } = useAssessment();

  const insightData = useMemo(() => {
    if (!assessmentData?.responses) return null;

    const industry = assessmentData.responses.industry || 'Technology';
    const processComplexity = assessmentData.responses.processComplexity || 'Medium';
    const manualProcesses = assessmentData.responses.manualProcesses || [];
    
    // Calculate automation score based on manual processes
    const automationScore = Math.max(20, 100 - (manualProcesses.length * 15));
    
    return {
      metrics: [
        {
          metric: 'Process Automation',
          industry: `${automationScore}%`,
          benchmark: '85%'
        },
        {
          metric: 'Efficiency Score',
          industry: processComplexity === 'Low' ? '90%' : processComplexity === 'Medium' ? '75%' : '60%',
          benchmark: '80%'
        }
      ]
    };
  }, [assessmentData?.responses]);

  if (!insightData) return null;

  return (
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
});