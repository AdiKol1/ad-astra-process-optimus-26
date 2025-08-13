import React, { useState, useEffect } from 'react';
import { useAssessment } from '@/contexts/assessment/AssessmentContext';
import { LoadingSpinner } from '@/components/ui/loading';
import { ErrorMessage } from '@/components/ui/error';

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

    if (!results.savings || !results.metrics) {
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

  if (!results?.savings || !results?.metrics) {
    return <ErrorMessage message="Assessment results are incomplete" />;
  }

  // Check for zero-improvement scenario
  const hasNoImprovementPotential = 
    results.savings.annual === 0 &&
    results.metrics.efficiency === 0;

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
    <div className="assessment-results">
      <h2>Assessment Results</h2>
      <div className="results-summary">
        <div className="annual-savings">
          <h3>Annual Impact</h3>
          <p>Potential Savings: ${results.savings.annual.toLocaleString()}</p>
          <p>Hours Saved: {results.savings.monthly * 12 * 4} hrs/year</p>
        </div>
        <div className="automation-metrics">
          <h3>Automation Impact</h3>
          <p>Current Process Cost: ${results.costs.current.toLocaleString()}</p>
          <p>Projected Cost: ${results.costs.projected.toLocaleString()}</p>
          <p>Potential Reduction: {(results.costs.current - results.costs.projected) / results.costs.current * 100}%</p>
          <p>ROI: {results.metrics.roi}%</p>
          <p>Efficiency Gain: {results.metrics.efficiency}%</p>
        </div>
      </div>
      <div className="completion-info">
        <p>Assessment completed on: {new Date(completedAt).toLocaleString()}</p>
      </div>
    </div>
  );
};

export default AssessmentResults;
