import React, { useState, useEffect } from 'react';
import { useAssessment } from '@/contexts/assessment/AssessmentContext';
import { LoadingSpinner } from '@/components/ui/loading';
import { ErrorMessage } from '@/components/ui/error';
import { ProcessResults } from '@/types/assessment/process';
import { CACMetrics } from '@/types/assessment';

const AssessmentResults: React.FC = () => {
  const { state: { results, completedAt } } = useAssessment();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!results) {
      setError('No assessment results available');
      setLoading(false);
      return;
    }

    if (!results.annual || !results.cac) {
      setError('Missing required metrics in assessment results');
      setLoading(false);
      return;
    }

    setLoading(false);
  }, [results]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!results?.annual || !results?.cac) {
    return <ErrorMessage message="Assessment results are incomplete" />;
  }

  const { annual, cac } = results;
  const { process: processScore, marketing: marketingScore } = results.sectionScores || {};
  const { process: processRecommendations, marketing: marketingRecommendations } = results.recommendations || {};

  // Check for zero-improvement scenario
  const hasNoImprovementPotential = 
    results.annual.savings === 0 && 
    results.annual.hours === 0 && 
    results.cac.efficiency === 0;

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
            {formatCurrency(annual.savings)}
          </p>
          <p className="mt-2 text-sm text-gray-600">
            Projected savings over the next 12 months
          </p>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-semibold">Time Saved</h3>
          <p className="mt-2 text-3xl font-bold text-primary">
            {annual.hours.toLocaleString()} hrs
          </p>
          <p className="mt-2 text-sm text-gray-600">
            Hours saved annually through automation
          </p>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-semibold">Overall Score</h3>
          <p className="mt-2 text-3xl font-bold text-primary">
            {results.qualificationScore}%
          </p>
          <p className="mt-2 text-sm text-gray-600">
            Your automation readiness score
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-semibold">Process Assessment</h3>
          <div className="mt-4 space-y-3">
            <div className="flex justify-between">
              <span>Process Score:</span>
              <span className="font-semibold">{processScore}%</span>
            </div>
            <div className="flex justify-between">
              <span>Automation Potential:</span>
              <span className="font-semibold">{results.automationPotential}%</span>
            </div>
          </div>
          {processRecommendations && processRecommendations.length > 0 && (
            <div className="mt-4">
              <h4 className="font-medium mb-2">Recommendations:</h4>
              <ul className="list-disc pl-5 space-y-1">
                {processRecommendations.map((rec, index) => (
                  <li key={index} className="text-sm text-gray-600">{rec}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-semibold">Marketing Impact</h3>
          <div className="mt-4 space-y-3">
            <div className="flex justify-between">
              <span>Marketing Score:</span>
              <span className="font-semibold">{marketingScore}%</span>
            </div>
            <div className="flex justify-between">
              <span>Current CAC:</span>
              <span className="font-semibold">{formatCurrency(cac.currentCAC)}</span>
            </div>
            <div className="flex justify-between">
              <span>Projected CAC:</span>
              <span className="font-semibold">{formatCurrency(cac.projectedCAC)}</span>
            </div>
            <div className="flex justify-between">
              <span>Potential Reduction:</span>
              <span className="font-semibold">{formatPercentage(cac.potentialReduction)}</span>
            </div>
          </div>
          {marketingRecommendations && marketingRecommendations.length > 0 && (
            <div className="mt-4">
              <h4 className="font-medium mb-2">Recommendations:</h4>
              <ul className="list-disc pl-5 space-y-1">
                {marketingRecommendations.map((rec, index) => (
                  <li key={index} className="text-sm text-gray-600">{rec}</li>
                ))}
              </ul>
            </div>
          )}
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
