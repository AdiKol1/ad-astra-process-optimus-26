import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Info } from 'lucide-react';
import { calculateAutomationPotential } from '@/utils/calculations';
import { MarketingMetrics } from './marketing/MarketingMetrics';
import { PerformanceCharts } from './marketing/PerformanceCharts';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  Tooltip
} from 'recharts';

interface ResultsVisualizationProps {
  assessmentScore: {
    overall: number;
    sections?: Record<string, { percentage: number }>;
    automationPotential: number;
  };
  results: {
    annual: {
      savings: number;
      hours: number;
    };
  };
}

export const ResultsVisualization: React.FC<ResultsVisualizationProps> = ({
  assessmentScore,
  results
}) => {
  console.log('Assessment Score:', assessmentScore);
  console.log('Results:', results);

  // Safely transform sections data or provide fallback
  const radarData = React.useMemo(() => {
    if (!assessmentScore?.sections) {
      console.log('No sections data available');
      return [];
    }

    return Object.entries(assessmentScore.sections).map(([key, value]) => ({
      subject: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1').trim(),
      score: Math.round(value.percentage || 0),
      insight: getSectionInsight(key, value.percentage || 0)
    }));
  }, [assessmentScore?.sections]);

  console.log('Radar Data:', radarData);

  const barData = [
    { name: 'Marketing Maturity', value: Math.round(assessmentScore?.overall || 0) },
    { name: 'Automation Potential', value: Math.round(assessmentScore?.automationPotential || 0) },
    { name: 'ROI Potential', value: Math.round(Math.min((results?.annual?.savings / 10000) * 100 || 0, 100)) }
  ];

  console.log('Bar Data:', barData);

  const marketingMetrics = {
    cac: calculateCAC(assessmentScore),
    conversionRate: calculateConversionRate(assessmentScore),
    automationLevel: assessmentScore?.automationPotential || 0,
    roiScore: calculateROIScore(assessmentScore, results)
  };

  // If we don't have any data, show a message
  if (!assessmentScore || !results) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">
            No assessment data available. Please complete the assessment first.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Performance Distribution
            <Info className="h-4 w-4 text-muted-foreground" />
          </CardTitle>
          <CardDescription>
            Comprehensive analysis of your operational capabilities and automation potential
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <MarketingMetrics metrics={marketingMetrics} />
          {radarData.length > 0 && (
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart 
                  data={radarData} 
                  margin={{ top: 30, right: 40, bottom: 30, left: 40 }}
                >
                  <PolarGrid stroke="#475569" />
                  <PolarAngleAxis 
                    dataKey="subject"
                    tick={{ 
                      fill: '#e2e8f0', 
                      fontSize: 12,
                      dy: 4 
                    }}
                    stroke="#475569"
                  />
                  <Radar
                    name="Score"
                    dataKey="score"
                    fill="#3b82f6"
                    fillOpacity={0.6}
                    stroke="#3b82f6"
                  />
                  <Tooltip content={({ payload }) => (
                    <div className="bg-background border p-2 rounded-lg shadow-lg">
                      {payload?.[0]?.payload && (
                        <div className="space-y-1">
                          <p className="font-medium text-primary">{payload[0].payload.subject}</p>
                          <p className="text-primary">Score: {payload[0].payload.score}%</p>
                          <p className="text-sm text-muted-foreground">
                            {payload[0].payload.insight}
                          </p>
                        </div>
                      )}
                    </div>
                  )}/>
                </RadarChart>
              </ResponsiveContainer>
            </div>
          )}
          <div className="p-4 bg-space-light rounded-lg">
            <h4 className="font-medium mb-2">Projected Annual Benefits</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Cost Savings</p>
                <p className="text-xl font-bold">${results.annual.savings.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Time Saved (hrs/year)</p>
                <p className="text-xl font-bold">{results.annual.hours}</p>
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
  return Math.round(Math.min((assessmentScore?.overall || 0) * 1.2, 100));
};

const calculateConversionRate = (assessmentScore: ResultsVisualizationProps['assessmentScore']) => {
  return Math.round(Math.min((assessmentScore?.overall || 0) * 1.1, 100));
};

const calculateROIScore = (
  assessmentScore: ResultsVisualizationProps['assessmentScore'],
  results: ResultsVisualizationProps['results']
) => {
  return Math.round(Math.min((results?.annual?.savings / 10000) * 100 || 0, 100));
};

const getSectionInsight = (sectionName: string, score: number) => {
  const insights: Record<string, Record<string, string>> = {
    processDetails: {
      high: "Your process documentation is well-established.",
      medium: "There's potential to enhance your processes.",
      low: "Implementing better process documentation could significantly improve efficiency."
    },
    technology: {
      high: "Your technology infrastructure is well-established.",
      medium: "There's potential to enhance your technology capabilities.",
      low: "Implementing new technology could significantly improve efficiency."
    },
    processes: {
      high: "Strong operational processes are in place.",
      medium: "Opportunity to optimize operational processes.",
      low: "Focus on building systematic operational processes."
    },
    team: {
      high: "Strong team structure and capabilities.",
      medium: "Room to improve team organization.",
      low: "Focus on team development and structure."
    },
    challenges: {
      high: "Well-managed operational challenges.",
      medium: "Some challenges need attention.",
      low: "Several challenges require immediate attention."
    }
  };

  const category = score >= 70 ? 'high' : score >= 40 ? 'medium' : 'low';
  return insights[sectionName]?.[category] || "Analyze this area for optimization opportunities.";
};