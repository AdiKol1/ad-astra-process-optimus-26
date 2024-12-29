import React from 'react';
import { useAssessment } from '../../../contexts/assessment/AssessmentContext';
import { LoadingSpinner } from '../../../components/ui/loading';
import { ErrorMessage } from '../../../components/ui/error';
import { MarketingResults } from '../../../types/assessment/marketing';

const AssessmentResults: React.FC = () => {
  const { 
    state: { completed },
    processResults,
    marketingResults,
    isLoading,
    error: contextError
  } = useAssessment();

  // Show loading state while calculating
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Show context error if any
  if (contextError) {
    return <ErrorMessage message={contextError} />;
  }

  // Check if assessment is completed
  if (!completed) {
    return <ErrorMessage message="Please complete the assessment first" />;
  }

  // Check for required results
  if (!processResults || !marketingResults) {
    return <ErrorMessage message="Assessment results are not available. Please try again." />;
  }

  // Check for zero-improvement scenario
  const hasNoImprovementPotential = 
    marketingResults.savings.annual === 0 && 
    marketingResults.metrics.efficiency === 0;

  if (hasNoImprovementPotential) {
    return (
      <div className="assessment-results">
        <h2>Assessment Results</h2>
        <div className="no-improvement-needed">
          <h3>No Immediate Automation Needed</h3>
          <p>Based on your responses, your current processes are running efficiently. Here's why:</p>
          <ul>
            <li>Your reported time investment is minimal</li>
            <li>Error rates are within acceptable ranges</li>
            <li>Process volumes don't justify automation costs</li>
          </ul>
          <p>Recommendations:</p>
          <ul>
            <li>Continue monitoring process efficiency</li>
            <li>Document your current workflows</li>
            <li>Re-evaluate in 6 months as your business grows</li>
          </ul>
        </div>
      </div>
    );
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
            {formatCurrency(marketingResults.savings.annual)}
          </p>
          <p className="mt-2 text-sm text-gray-600">
            Projected savings over the next 12 months
          </p>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-semibold">Efficiency Gain</h3>
          <p className="mt-2 text-3xl font-bold text-primary">
            {formatPercentage(marketingResults.metrics.efficiency)}
          </p>
          <p className="mt-2 text-sm text-gray-600">
            Projected efficiency improvement
          </p>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-semibold">ROI</h3>
          <p className="mt-2 text-3xl font-bold text-primary">
            {formatPercentage(marketingResults.metrics.roi)}
          </p>
          <p className="mt-2 text-sm text-gray-600">
            Return on investment
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-semibold">Process Assessment</h3>
          <div className="mt-4 space-y-3">
            <div className="flex justify-between">
              <span>Automation Level:</span>
              <span className="font-semibold">
                {formatPercentage(marketingResults.metrics.automationLevel)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Payback Period:</span>
              <span className="font-semibold">
                {marketingResults.metrics.paybackPeriodMonths} months
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-semibold">Cost Analysis</h3>
          <div className="mt-4 space-y-3">
            <div className="flex justify-between">
              <span>Current Costs:</span>
              <span className="font-semibold">
                {formatCurrency(marketingResults.costs.current)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Projected Costs:</span>
              <span className="font-semibold">
                {formatCurrency(marketingResults.costs.projected)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Monthly Savings:</span>
              <span className="font-semibold">
                {formatCurrency(marketingResults.savings.monthly)}
              </span>
            </div>
          </div>
          <div className="mt-4">
            <h4 className="font-medium mb-2">Cost Breakdown:</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Labor:</span>
                <span>{formatCurrency(marketingResults.costs.breakdown.labor.current)} → {formatCurrency(marketingResults.costs.breakdown.labor.projected)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tools:</span>
                <span>{formatCurrency(marketingResults.costs.breakdown.tools.current)} → {formatCurrency(marketingResults.costs.breakdown.tools.projected)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Overhead:</span>
                <span>{formatCurrency(marketingResults.costs.breakdown.overhead.current)} → {formatCurrency(marketingResults.costs.breakdown.overhead.projected)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

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

export default AssessmentResults;
