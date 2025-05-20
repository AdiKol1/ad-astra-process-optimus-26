import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { AssessmentResults as AssessmentResultsType } from '@/types/assessment/state';

interface AssessmentResultsProps {
  title?: string;
}

const AssessmentResults: React.FC<AssessmentResultsProps> = ({
  title = "Assessment Results"
}) => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4">{title}</h1>
      <div className="mb-6">
        <p className="text-gray-700 mb-4">
          Thank you for completing the assessment. Your results are available below.
        </p>
        <div className="bg-blue-50 p-4 rounded-md">
          <h2 className="text-xl font-semibold mb-2">Summary</h2>
          <p className="mb-2">
            Based on your responses, we've identified several opportunities for process optimization.
          </p>
          <div className="grid gap-4 mt-4">
            <div className="border-l-4 border-green-500 pl-4 py-2">
              <h3 className="font-medium">Efficiency Score</h3>
              <p className="text-lg font-bold">75/100</p>
            </div>
            <div className="border-l-4 border-blue-500 pl-4 py-2">
              <h3 className="font-medium">Potential Time Savings</h3>
              <p className="text-lg font-bold">12 hours/week</p>
            </div>
            <div className="border-l-4 border-purple-500 pl-4 py-2">
              <h3 className="font-medium">Automation Opportunities</h3>
              <p className="text-lg font-bold">4 identified</p>
            </div>
          </div>
            </div>
          </div>
      
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">Key Recommendations</h2>
        <ul className="space-y-3">
          <li className="p-3 bg-gray-50 rounded">
            <span className="font-medium block">Document Management Automation</span>
            <span className="text-gray-600">Implement a centralized document management system with automated workflows.</span>
          </li>
          <li className="p-3 bg-gray-50 rounded">
            <span className="font-medium block">Process Standardization</span>
            <span className="text-gray-600">Create standardized processes for core business operations.</span>
          </li>
          <li className="p-3 bg-gray-50 rounded">
            <span className="font-medium block">Task Delegation</span>
            <span className="text-gray-600">Implement clear role definitions and task assignment protocols.</span>
          </li>
        </ul>
                  </div>
      
      <div className="mt-8 flex justify-center">
        <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">
          Download Full Report
        </button>
          </div>
    </div>
  );
};

export default AssessmentResults;