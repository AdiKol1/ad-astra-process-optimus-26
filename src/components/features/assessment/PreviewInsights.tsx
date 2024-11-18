import React, { useEffect } from 'react';
import { AssessmentData } from './AssessmentContext';
import { FiLock, FiTrendingUp, FiDollarSign, FiClock } from 'react-icons/fi';
import { Analytics, trackEvent } from './utils/analytics';

interface PreviewInsightsProps {
  assessmentData: AssessmentData;
}

const PreviewInsights: React.FC<PreviewInsightsProps> = ({ assessmentData }) => {
  // Calculate preview metrics
  const calculatePreviewMetrics = () => {
    const responses = assessmentData.responses;
    
    // Basic efficiency calculation
    const avgProcessTime = Object.values(responses.processTime || {}).reduce((a: number, b: number) => a + b, 0) / 
                         (Object.keys(responses.processTime || {}).length || 1);
    
    // Estimated savings calculation (simplified preview)
    const teamSize = responses.teamSize || 0;
    const avgHourlyRate = responses.hourlyRates?.specialistRate || 50;
    const potentialTimeReduction = 0.3; // Show 30% potential improvement in preview
    
    const estimatedAnnualSavings = Math.round(
      teamSize * avgHourlyRate * avgProcessTime * potentialTimeReduction * 252 // 252 working days
    );

    return {
      efficiency: Math.min(0.7, 1 - (avgProcessTime / 30)), // Cap at 70% to encourage full report
      savings: estimatedAnnualSavings,
      automationPotential: responses.manualProcesses?.length || 0,
      timeReduction: potentialTimeReduction * 100
    };
  };

  const metrics = calculatePreviewMetrics();

  useEffect(() => {
    // Track preview insights view
    trackEvent({
      category: 'Preview',
      action: 'View',
      metadata: {
        efficiency_score: (metrics.efficiency * 100).toFixed(1),
        estimated_savings: metrics.savings,
        automation_opportunities: metrics.automationPotential,
        time_reduction: metrics.timeReduction,
      },
    });
  }, [metrics]);

  const handleMetricClick = (metricName: string, value: number | string) => {
    trackEvent({
      category: 'Preview',
      action: 'Metric_Click',
      label: metricName,
      metadata: {
        metric_value: value,
      },
    });
  };

  const handleLockedInsightClick = (insightType: string) => {
    trackEvent({
      category: 'Preview',
      action: 'Locked_Insight_Click',
      label: insightType,
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <h3 className="text-blue-800 font-semibold mb-2">
          Preview of Your Assessment Results
        </h3>
        <p className="text-sm text-blue-600">
          Unlock your full, personalized report by completing the form below
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Efficiency Score Preview */}
        <div 
          className="bg-white p-4 rounded-lg border border-gray-200 cursor-pointer hover:border-blue-300 transition-colors"
          onClick={() => handleMetricClick('efficiency', (metrics.efficiency * 100).toFixed(1))}
        >
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-gray-800">Process Efficiency</h4>
              <p className="text-2xl font-bold text-blue-600">
                {(metrics.efficiency * 100).toFixed(1)}%
              </p>
            </div>
            <FiTrendingUp className="text-blue-500 text-2xl" />
          </div>
          <div className="mt-2">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${metrics.efficiency * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Potential Savings Preview */}
        <div 
          className="bg-white p-4 rounded-lg border border-gray-200 cursor-pointer hover:border-green-300 transition-colors"
          onClick={() => handleMetricClick('savings', metrics.savings)}
        >
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-gray-800">Potential Savings</h4>
              <p className="text-2xl font-bold text-green-600">
                ${(metrics.savings / 1000).toFixed(1)}k+
              </p>
            </div>
            <FiDollarSign className="text-green-500 text-2xl" />
          </div>
          <p className="text-sm text-gray-600 mt-2">Estimated annual savings</p>
        </div>
      </div>

      {/* Locked Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div 
          className="bg-gray-50 p-4 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors"
          onClick={() => handleLockedInsightClick('automation')}
        >
          <div className="flex items-center space-x-2">
            <FiLock className="text-gray-400" />
            <h4 className="font-semibold text-gray-400">Automation Opportunities</h4>
          </div>
          <p className="text-sm text-gray-400 mt-2">
            {metrics.automationPotential} processes identified for automation
          </p>
        </div>

        <div 
          className="bg-gray-50 p-4 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors"
          onClick={() => handleLockedInsightClick('time_reduction')}
        >
          <div className="flex items-center space-x-2">
            <FiLock className="text-gray-400" />
            <h4 className="font-semibold text-gray-400">Time Reduction</h4>
          </div>
          <p className="text-sm text-gray-400 mt-2">
            Up to {metrics.timeReduction}% process time reduction possible
          </p>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg mt-6">
        <h3 className="font-semibold text-blue-800 mb-2">
          Unlock Your Full Assessment Report
        </h3>
        <ul className="text-sm text-blue-700 space-y-2">
          <li>• Detailed process analysis and recommendations</li>
          <li>• Complete ROI calculation and implementation roadmap</li>
          <li>• Industry benchmarks and best practices</li>
          <li>• Prioritized automation opportunities</li>
        </ul>
      </div>
    </div>
  );
};

export default PreviewInsights;