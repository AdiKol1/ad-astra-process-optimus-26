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
import { Card, CardContent } from '@/components/ui/card';

interface PerformanceChartsProps {
  radarData: Array<{
    subject: string;
    score: number;
    insight: string;
  }>;
  barData: Array<{
    name: string;
    value: number;
  }>;
}

export const PerformanceCharts: React.FC<PerformanceChartsProps> = ({
  radarData,
  barData
}) => {
  // Transform the data to include more descriptive names
  const enhancedBarData = barData.map(item => ({
    ...item,
    name: getEnhancedLabel(item.name),
    description: getMetricDescription(item.name)
  }));

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Performance Distribution</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#FDB813" />
                <PolarAngleAxis 
                  dataKey="subject"
                  tick={{ fill: '#FDB813', fontSize: 14 }}
                  stroke="#FDB813"
                />
                <Radar
                  name="Score"
                  dataKey="score"
                  fill="#FDB813"
                  fillOpacity={0.6}
                  stroke="#FDB813"
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
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Overall Marketing Performance</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={enhancedBarData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: '#94a3b8' }}
                  stroke="#94a3b8"
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis 
                  domain={[0, 100]} 
                  tick={{ fill: '#94a3b8' }}
                  stroke="#94a3b8"
                  label={{ 
                    value: 'Percentage (%)', 
                    angle: -90, 
                    position: 'insideLeft',
                    fill: '#94a3b8'
                  }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b',
                    border: '1px solid #475569',
                    borderRadius: '8px',
                    padding: '12px'
                  }}
                  labelStyle={{ color: '#e2e8f0', fontWeight: 'bold', marginBottom: '8px' }}
                  itemStyle={{ color: '#e2e8f0' }}
                  formatter={(value: number, name: string, props: any) => {
                    return [
                      `${value}%`,
                      props.payload.description
                    ];
                  }}
                />
                <Legend 
                  wrapperStyle={{ color: '#94a3b8' }}
                />
                <Bar 
                  dataKey="value" 
                  fill="#60a5fa"
                  name="Current Performance Level"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const getEnhancedLabel = (name: string): string => {
  switch (name) {
    case 'Marketing Maturity':
      return 'Current Marketing Effectiveness';
    case 'Automation Potential':
      return 'Automation Opportunity';
    case 'ROI Potential':
      return 'Expected ROI';
    default:
      return name;
  }
};

const getMetricDescription = (name: string): string => {
  switch (name) {
    case 'Marketing Maturity':
      return 'Current effectiveness of marketing processes';
    case 'Automation Potential':
      return 'Opportunity to improve through automation';
    case 'ROI Potential':
      return 'Projected return on investment';
    default:
      return '';
  }
};