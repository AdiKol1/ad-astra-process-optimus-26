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
import { calculateAutomationPotential } from '@/utils/calculations';

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
  if (score >= 80) return { label: 'Advanced Marketing Automation', color: 'bg-green-500' };
  if (score >= 60) return { label: 'Growth Ready', color: 'bg-blue-500' };
  if (score >= 40) return { label: 'Scaling Phase', color: 'bg-yellow-500' };
  return { label: 'Optimization Needed', color: 'bg-red-500' };
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
    { name: 'Marketing Maturity Score', value: assessmentScore.overall },
    { name: 'Automation Potential', value: assessmentScore.automationPotential },
    { name: 'ROI Potential', value: Math.min((automationResults.savings.annual / 10000) * 100, 100) }
  ];

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
        <CardContent className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Performance Distribution</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis 
                    dataKey="subject"
                    tick={{ fill: 'var(--color-gold)', fontSize: 14 }}
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
                          <p className="font-medium text-gold">{payload[0].payload.subject}</p>
                          <p className="text-gold">Score: {payload[0].payload.score}%</p>
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
            <h3 className="text-lg font-semibold">Marketing Automation Benefits</h3>
            <div className="space-y-4">
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
          <h3 className="text-lg font-semibold mb-4">Overall Marketing Performance</h3>
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