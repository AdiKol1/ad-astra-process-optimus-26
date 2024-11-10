import React from 'react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Info } from 'lucide-react';

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

const getScoreCategory = (score: number) => {
  if (score >= 80) return { label: 'Excellent', color: 'bg-green-500' };
  if (score >= 60) return { label: 'Good', color: 'bg-blue-500' };
  if (score >= 40) return { label: 'Fair', color: 'bg-yellow-500' };
  return { label: 'Needs Improvement', color: 'bg-red-500' };
};

const getSectionInsight = (sectionName: string, score: number) => {
  const insights: Record<string, Record<string, string>> = {
    processDetails: {
      high: "Your process documentation and workflow structure are well-defined.",
      medium: "There's room to improve process documentation and standardization.",
      low: "Consider formalizing your process documentation and workflows."
    },
    technology: {
      high: "Your technology stack is well-integrated and modern.",
      medium: "Some technology upgrades could enhance efficiency.",
      low: "Technology modernization should be a priority."
    }
  };

  const category = score >= 70 ? 'high' : score >= 40 ? 'medium' : 'low';
  return insights[sectionName]?.[category] || "Analyze this area for optimization opportunities.";
};

export const ResultsVisualization: React.FC<ResultsVisualizationProps> = ({
  assessmentScore,
  results
}) => {
  const radarData = Object.entries(assessmentScore.sections).map(([key, value]) => ({
    subject: key.replace(/([A-Z])/g, ' $1').trim(),
    score: value.percentage,
    insight: getSectionInsight(key, value.percentage)
  }));

  const barData = [
    { name: 'Overall Score', value: assessmentScore.overall },
    { name: 'Automation Potential', value: assessmentScore.automationPotential }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Section Scores Analysis
            <Info className="h-4 w-4 text-muted-foreground" />
          </CardTitle>
          <CardDescription>
            Detailed breakdown of your process optimization assessment results
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Score Distribution</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis 
                    dataKey="subject"
                    tick={{ fill: 'var(--foreground)', fontSize: 12 }}
                  />
                  <Radar
                    name="Score"
                    dataKey="score"
                    fill="var(--color-gold)"
                    fillOpacity={0.6}
                  />
                  <Tooltip content={({ payload }) => (
                    <div className="bg-background border p-2 rounded-lg shadow-lg">
                      {payload?.[0]?.payload && (
                        <div className="space-y-1">
                          <p className="font-medium">{payload[0].payload.subject}</p>
                          <p>Score: {payload[0].payload.score}%</p>
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
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Performance Overview</h3>
            <div className="space-y-4">
              {Object.entries(assessmentScore.sections).map(([key, value]) => {
                const { label, color } = getScoreCategory(value.percentage);
                return (
                  <div key={key} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <Badge className={color}>
                        {label} - {value.percentage}%
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {getSectionInsight(key, value.percentage)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Overall Performance</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="var(--color-gold)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};