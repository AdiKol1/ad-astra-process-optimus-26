import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Info } from 'lucide-react';
import { calculateAutomationPotential } from '@/utils/calculations';
import { MarketingMetrics } from './marketing/MarketingMetrics';
import { PerformanceCharts } from './marketing/PerformanceCharts';

interface ResultsVisualizationProps {
  assessmentScore: {
    overall: number;
    sections: Record<string, { percentage: number }>;
    automationPotential: number;
  };
  results: {
    savings: {
      annual: number;
    };
  };
}

export const ResultsVisualization: React.FC<ResultsVisualizationProps> = ({
  assessmentScore,
  results
}) => {
  const automationResults = calculateAutomationPotential({
    employees: 5,
    timeSpent: 40,
    processVolume: "100-500",
    errorRate: "3-5%"
  });

  const radarData = Object.entries(assessmentScore.sections).map(([key, value]) => ({
    subject: key.replace(/([A-Z])/g, ' $1').trim(),
    score: value.percentage,
    insight: getSectionInsight(key, value.percentage)
  }));

  const barData = [
    { name: 'Marketing Maturity', value: assessmentScore.overall },
    { name: 'Automation Potential', value: assessmentScore.automationPotential },
    { name: 'ROI Potential', value: Math.min((automationResults.savings.annual / 10000) * 100, 100) }
  ];

  const marketingMetrics = {
    cac: calculateCAC(assessmentScore),
    conversionRate: calculateConversionRate(assessmentScore),
    automationLevel: assessmentScore.automationPotential,
    roiScore: calculateROIScore(assessmentScore, results)
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Marketing Performance Analysis
            <Info className="h-4 w-4 text-muted-foreground" />
          </CardTitle>
          <CardDescription>
            Comprehensive analysis of your digital marketing capabilities and automation potential
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <MarketingMetrics metrics={marketingMetrics} />
          <PerformanceCharts radarData={radarData} barData={barData} />
          
          <div className="p-4 bg-space-light rounded-lg">
            <h4 className="font-medium mb-2">Projected Annual Benefits</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Cost Savings</p>
                <p className="text-xl font-bold">${automationResults.savings.annual.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Time Saved (hrs/year)</p>
                <p className="text-xl font-bold">{Math.round(automationResults.efficiency.timeReduction * 260)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Error Reduction</p>
                <p className="text-xl font-bold">{automationResults.efficiency.errorReduction}%</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Productivity Gain</p>
                <p className="text-xl font-bold">{automationResults.efficiency.productivity}%</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Helper functions for calculating marketing metrics
const calculateCAC = (assessmentScore: ResultsVisualizationProps['assessmentScore']) => {
  // Calculate Customer Acquisition Cost score based on assessment data
  return Math.min(assessmentScore.overall * 1.2, 100);
};

const calculateConversionRate = (assessmentScore: ResultsVisualizationProps['assessmentScore']) => {
  // Calculate Conversion Rate score based on assessment data
  return Math.min(assessmentScore.overall * 1.1, 100);
};

const calculateROIScore = (
  assessmentScore: ResultsVisualizationProps['assessmentScore'],
  results: ResultsVisualizationProps['results']
) => {
  // Calculate ROI score based on assessment data and results
  return Math.min((results.savings.annual / 10000) * 100, 100);
};

const getSectionInsight = (sectionName: string, score: number) => {
  const insights: Record<string, Record<string, string>> = {
    marketingAutomation: {
      high: "Your marketing automation infrastructure is well-established.",
      medium: "There's potential to enhance your automation capabilities.",
      low: "Implementing marketing automation could significantly improve efficiency."
    },
    leadGeneration: {
      high: "Strong lead generation processes are in place.",
      medium: "Opportunity to optimize lead generation strategies.",
      low: "Focus on building systematic lead generation processes."
    },
    customerAcquisition: {
      high: "Efficient customer acquisition funnel.",
      medium: "Room to improve conversion rates.",
      low: "Prioritize streamlining the acquisition process."
    },
    analytics: {
      high: "Comprehensive analytics and tracking in place.",
      medium: "Consider expanding your analytics capabilities.",
      low: "Implement robust analytics for better decision making."
    }
  };

  const category = score >= 70 ? 'high' : score >= 40 ? 'medium' : 'low';
  return insights[sectionName]?.[category] || "Analyze this area for optimization opportunities.";
};