import React from 'react';
import { Card } from '@/components/ui/card';
import type { AssessmentData, SectionScore } from '../types';

interface ROIProjectionProps {
  assessmentData: AssessmentData;
  sectionScores: Record<string, SectionScore>;
}

const ROIProjection: React.FC<ROIProjectionProps> = ({
  assessmentData,
  sectionScores,
}) => {
  const calculateROI = () => {
    const totalScore = Object.values(sectionScores).reduce((acc, curr) => acc + (curr.score || 0), 0);
    const averageScore = totalScore / Object.keys(sectionScores).length;
    
    // Base calculations
    const baseHoursSaved = 2080 * averageScore; // Based on annual work hours
    const hourlyRate = 50; // Average hourly rate
    const annualSavings = baseHoursSaved * hourlyRate;
    const implementationCost = 50000 * (1 - averageScore); // Higher score means lower implementation cost
    
    return {
      hoursSaved: Math.round(baseHoursSaved),
      annualSavings: Math.round(annualSavings),
      implementationCost: Math.round(implementationCost),
      paybackPeriod: Math.round((implementationCost / annualSavings) * 12), // in months
    };
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const roi = calculateROI();

  return (
    <Card className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">ROI Projection</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Annual Impact</h3>
          <div className="space-y-2">
            <div>
              <p className="text-gray-600">Hours Saved</p>
              <p className="text-2xl font-bold">{roi.hoursSaved.toLocaleString()} hours</p>
            </div>
            <div>
              <p className="text-gray-600">Cost Savings</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(roi.annualSavings)}</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Implementation</h3>
          <div className="space-y-2">
            <div>
              <p className="text-gray-600">Estimated Cost</p>
              <p className="text-2xl font-bold">{formatCurrency(roi.implementationCost)}</p>
            </div>
            <div>
              <p className="text-gray-600">Payback Period</p>
              <p className="text-2xl font-bold">{roi.paybackPeriod} months</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-800">Key Takeaway</h3>
        <p className="text-blue-600">
          Based on our analysis, implementing the recommended process improvements could 
          result in annual savings of {formatCurrency(roi.annualSavings)} with an estimated
          payback period of {roi.paybackPeriod} months.
        </p>
      </div>
    </Card>
  );
};

export default ROIProjection;
