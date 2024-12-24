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
    <div className="assessment-results">
      <h2>Assessment Results</h2>
      <div className="results-summary">
        <div className="annual-savings">
          <h3>Annual Impact</h3>
          <p>Potential Savings: ${results.annual.savings.toLocaleString()}</p>
          <p>Hours Saved: {results.annual.hours} hrs/year</p>
        </div>
        <div className="automation-metrics">
          <h3>Automation Impact</h3>
          <p>Current Process Cost: ${results.cac.currentCAC.toLocaleString()}</p>
          <p>Projected Cost: ${results.cac.projectedCAC.toLocaleString()}</p>
          <p>Potential Reduction: {results.cac.potentialReduction}%</p>
          <p>ROI: {results.cac.automationROI}%</p>
          <p>Efficiency Gain: {results.cac.efficiency}%</p>
        </div>
      </div>
      <div className="completion-info">
        <p>Assessment completed on: {new Date(completedAt).toLocaleString()}</p>
      </div>
    </div>
  );
};

export default AssessmentResults;
