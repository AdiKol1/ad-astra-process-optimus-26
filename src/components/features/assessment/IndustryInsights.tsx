import React, { useMemo } from 'react';
import { useAssessment } from '@/contexts/AssessmentContext';

const IndustryInsights: React.FC = React.memo(() => {
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
          benchmark: '80%',
          trend: 'increasing',
          description: `Your ${industry.toLowerCase()} processes are ${automationScore < 50 ? 'below' : 'near'} industry standard`
        },
        {
          metric: 'Employee Productivity',
          industry: processComplexity === 'High' ? '62%' : '72%',
          benchmark: '85%',
          trend: 'stable',
          description: `${processComplexity} complexity impacts productivity`
        },
        {
          metric: 'Cost Efficiency',
          industry: processComplexity === 'High' ? '55%' : '70%',
          benchmark: '90%',
          trend: 'increasing',
          description: 'Potential for significant cost reduction'
        }
      ],
      industry,
      processComplexity
    };
  }, [assessmentData?.responses]);

  if (!insightData) return null;

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 my-4" role="region" aria-label="Industry Insights">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        {insightData.industry} Industry Insights
      </h3>
      <div className="space-y-6">
        {insightData.metrics.map((item) => (
          <div key={item.metric} className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">{item.metric}</p>
              <p className="text-xs text-gray-500 mb-1">{item.description}</p>
              <div className="flex items-center mt-1">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500" 
                    style={{ width: item.industry }}
                    role="progressbar"
                    aria-valuenow={parseInt(item.industry)}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  />
                </div>
                <span className="ml-2 text-sm text-gray-500">{item.industry}</span>
              </div>
            </div>
            <div className="ml-4 flex-shrink-0">
              <p className="text-sm text-gray-500">Target: {item.benchmark}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

IndustryInsights.displayName = 'IndustryInsights';

export default IndustryInsights;