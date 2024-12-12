import React from 'react';
import { useAssessment } from '@/contexts/AssessmentContext';
import { ProcessResults } from '@/utils/processAssessment/calculations';
import { CACMetrics } from '@/types/assessment';

export default function AssessmentResults() {
  const { assessmentData } = useAssessment();
  
  if (!assessmentData?.results) {
    console.error('Missing results in assessment data:', assessmentData);
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Assessment results are not available</p>
      </div>
    );
  }

  console.log('Assessment Results - Raw Data:', assessmentData.results);

  const processResults = assessmentData.results.process as ProcessResults;
  const cacMetrics = assessmentData.results.cac as CACMetrics;

  if (!processResults || !cacMetrics) {
    console.error('Missing required metrics:', { processResults, cacMetrics });
    return null;
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight">Your Automation Report</h2>
        <p className="mt-4 text-lg text-gray-600">
          Based on your responses, here's how automation can transform your business
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-semibold">Annual Savings</h3>
          <p className="mt-2 text-3xl font-bold text-primary">
            {formatCurrency(processResults.savings.annual)}
          </p>
          <p className="mt-2 text-sm text-gray-600">
            Projected savings over the next 12 months
          </p>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-semibold">Efficiency Gain</h3>
          <p className="mt-2 text-3xl font-bold text-primary">
            {formatPercentage(processResults.metrics.efficiency)}
          </p>
          <p className="mt-2 text-sm text-gray-600">
            Improvement in process efficiency
          </p>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-semibold">Error Reduction</h3>
          <p className="mt-2 text-3xl font-bold text-primary">
            {formatPercentage(processResults.metrics.errorReduction)}
          </p>
          <p className="mt-2 text-sm text-gray-600">
            Reduction in process errors
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-semibold">Cost Breakdown</h3>
          <div className="mt-4 space-y-3">
            <div className="flex justify-between">
              <span>Current Costs:</span>
              <span className="font-semibold">{formatCurrency(processResults.costs.current)}</span>
            </div>
            <div className="flex justify-between">
              <span>Projected Costs:</span>
              <span className="font-semibold">{formatCurrency(processResults.costs.projected)}</span>
            </div>
            <div className="flex justify-between">
              <span>Monthly Savings:</span>
              <span className="font-semibold">{formatCurrency(processResults.savings.monthly)}</span>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-semibold">ROI Analysis</h3>
          <div className="mt-4 space-y-3">
            <div className="flex justify-between">
              <span>Return on Investment:</span>
              <span className="font-semibold">{formatPercentage(processResults.metrics.roi)}</span>
            </div>
            <div className="flex justify-between">
              <span>Payback Period:</span>
              <span className="font-semibold">{processResults.metrics.paybackPeriodMonths} months</span>
            </div>
          </div>
        </div>
      </div>

      {cacMetrics && (
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-semibold mb-4">Marketing Impact</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-sm text-gray-600">CAC Reduction</h4>
              <p className="text-xl font-semibold mt-1">
                {formatPercentage(cacMetrics.potentialReduction)}
              </p>
            </div>
            <div>
              <h4 className="font-medium text-sm text-gray-600">Conversion Improvement</h4>
              <p className="text-xl font-semibold mt-1">
                {formatPercentage(cacMetrics.conversionImprovement / 100)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

const formatPercentage = (value: number): string => {
  return `${Math.round(value * 100)}%`;
};
