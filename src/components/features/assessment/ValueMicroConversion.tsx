import React from 'react';
import { useAssessment } from '../../../contexts/AssessmentContext';

const ValueMicroConversion: React.FC = React.memo(() => {
  const { assessmentData } = useAssessment();

  // Memoize any expensive calculations
  const conversionData = React.useMemo(() => {
    if (!assessmentData?.responses) return null;
    
    return {
      hasManualProcesses: assessmentData.responses.manualProcesses?.length > 0,
      processComplexity: assessmentData.responses.processComplexity || 'Medium',
      teamSize: assessmentData.responses.teamSize
    };
  }, [assessmentData?.responses]);

  if (!conversionData) return null;

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 my-4">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        Discover Your Optimization Potential
      </h3>
      <div className="space-y-4">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
              <span className="text-green-600">✓</span>
            </div>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-900">Process Analysis</p>
            <p className="text-sm text-gray-500">Identify inefficiencies and bottlenecks</p>
          </div>
        </div>
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-blue-600">$</span>
            </div>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-900">Cost Savings</p>
            <p className="text-sm text-gray-500">Calculate potential cost reductions</p>
          </div>
        </div>
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
              <span className="text-purple-600">↗</span>
            </div>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-900">Growth Opportunities</p>
            <p className="text-sm text-gray-500">Unlock your business potential</p>
          </div>
        </div>
      </div>
      <button
        className="mt-6 w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2 px-4 rounded-md hover:from-blue-700 hover:to-blue-800 transition-all"
        onClick={() => {
          // Add your conversion action here
          console.log('Value proposition clicked');
        }}
      >
        Start Your Free Assessment
      </button>
    </div>
  );
});

ValueMicroConversion.displayName = 'ValueMicroConversion';

export default ValueMicroConversion;