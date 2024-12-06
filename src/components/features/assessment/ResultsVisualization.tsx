import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Info } from 'lucide-react';
import { MarketingMetrics } from './marketing/MarketingMetrics';
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
    overall?: number;
    sections?: Record<string, { percentage: number }>;
    automationPotential?: number;
  };
  results: {
    annual: {
      savings: number;
      hours: number;
    };
  };
}

export const ResultsVisualization: React.FC<ResultsVisualizationProps> = ({
  assessmentScore = {},
  results
}) => {
  console.log('ResultsVisualization - Props:', { assessmentScore, results });

  // Safely transform sections data or provide fallback
  const radarData = React.useMemo(() => {
    if (!assessmentScore?.sections) {
      console.log('No sections data available');
      return [];
    }

    return Object.entries(assessmentScore.sections).map(([key, value]) => ({
      subject: key.charAt(0).toUpperCase() + key.slice(1),
      score: value.percentage || 0
    }));
  }, [assessmentScore?.sections]);

  // If we don't have any data, show a message
  if (!assessmentScore || !results || !results.annual) {
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

  const marketingMetrics = {
    cac: 0,
    conversionRate: 0,
    automationLevel: assessmentScore?.automationPotential || 0,
    roiScore: (results?.annual?.savings || 0) / 10000
  };

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
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#475569" />
                  <PolarAngleAxis 
                    dataKey="subject"
                    tick={{ fill: '#e2e8f0', fontSize: 12 }}
                    stroke="#475569"
                  />
                  <Radar
                    name="Score"
                    dataKey="score"
                    fill="#3b82f6"
                    fillOpacity={0.6}
                    stroke="#3b82f6"
                  />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          )}

          <div className="p-4 bg-space-light rounded-lg">
            <h4 className="font-medium mb-2">Projected Annual Benefits</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Cost Savings</p>
                <p className="text-xl font-bold">${(results.annual.savings || 0).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Time Saved (hrs/year)</p>
                <p className="text-xl font-bold">{results.annual.hours || 0}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};