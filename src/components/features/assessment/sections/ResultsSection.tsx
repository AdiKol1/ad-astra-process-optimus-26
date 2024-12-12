import React, { useEffect } from 'react';
import { useAssessment } from '@/contexts/AssessmentContext';
import { calculateAutomationPotential } from '@/utils/calculations';

const ResultsSection: React.FC = () => {
  const { assessmentData, setAssessmentData } = useAssessment();

  useEffect(() => {
    if (assessmentData && !assessmentData.results) {
      const results = calculateAutomationPotential({
        employees: assessmentData.processDetails.employees.toString(),
        timeSpent: assessmentData.processes.timeSpent.toString(),
        processVolume: assessmentData.processDetails.processVolume,
        errorRate: assessmentData.processes.errorRate,
        industry: assessmentData.processDetails.industry
      });

      setAssessmentData({
        ...assessmentData,
        results
      });
    }
  }, [assessmentData, setAssessmentData]);

  if (!assessmentData?.results) {
    return (
      <div className="max-w-4xl mx-auto text-center">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
        </div>
      </div>
    );
  }

  const { annual, automationPotential, roi } = assessmentData.results;

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold tracking-tight text-gray-900 text-center mb-8">
        Your Process Optimization Results
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Annual Impact</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Cost Savings</p>
              <p className="text-2xl font-bold text-blue-600">
                ${annual.savings.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Hours Saved</p>
              <p className="text-2xl font-bold text-blue-600">
                {annual.hours.toLocaleString()} hrs
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Automation Potential</h3>
          <div className="flex items-center justify-center h-24">
            <p className="text-4xl font-bold text-blue-600">
              {automationPotential}%
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">ROI</h3>
          <div className="flex items-center justify-center h-24">
            <p className="text-4xl font-bold text-blue-600">
              {roi}x
            </p>
          </div>
        </div>
      </div>

      <div className="mt-12 text-center">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Next Steps
        </h3>
        <p className="text-gray-600 mb-8">
          Based on your assessment results, we recommend scheduling a consultation
          to discuss how we can help you achieve these optimization goals.
        </p>
        <button
          className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          onClick={() => {
            // TODO: Implement scheduling logic
          }}
        >
          Schedule Consultation
        </button>
      </div>
    </div>
  );
};

export default ResultsSection;
