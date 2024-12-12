import React from 'react';
import { useAssessment } from '@/contexts/AssessmentContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { calculateAutomationPotential } from '@/utils/calculations';

export default function ResultsSection() {
  const { formData } = useAssessment();
  const results = calculateAutomationPotential(formData);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          Your Process Optimization Results
        </h2>
        <p className="mt-2 text-lg text-gray-600">
          Based on your responses, here's what we found
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Current Costs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Labor Costs</p>
                <p className="text-2xl font-bold">${results.costs.labor.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Error-Related Costs</p>
                <p className="text-2xl font-bold">${results.costs.errors.toLocaleString()}</p>
              </div>
              <div className="pt-4 border-t">
                <p className="text-sm font-medium text-gray-500">Total Current Costs</p>
                <p className="text-3xl font-bold text-primary">
                  ${results.costs.current.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Potential Savings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Automation Potential</p>
                <p className="text-2xl font-bold">{results.automationPotential}%</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Annual Savings</p>
                <p className="text-3xl font-bold text-green-600">
                  ${results.savings.annual.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">ROI Timeline</p>
                <p className="text-xl font-semibold">{results.roi.timeline} months</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Next Steps</h3>
        <div className="space-y-4">
          <p>
            Based on your assessment results, we recommend the following steps to optimize your
            processes:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Schedule a consultation with our process optimization experts</li>
            <li>Get a detailed analysis of your automation opportunities</li>
            <li>Receive a customized implementation plan</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
