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
import { Info } from 'lucide-react';

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
              <RadarChart data={radarData} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
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
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Overall Marketing Performance</h3>
            <div className="relative group">
              <Info className="h-5 w-5 text-muted-foreground cursor-help" />
              <div className="absolute hidden group-hover:block right-0 w-64 p-2 bg-popover text-popover-foreground text-sm rounded-lg shadow-lg border mt-2 z-50">
                This chart shows your current performance levels across key marketing metrics. Higher percentages indicate stronger capabilities and readiness for optimization.
              </div>
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={enhancedBarData} 
                margin={{ top: 20, right: 30, bottom: 50, left: 30 }}
                barSize={40}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#475569" opacity={0.3} />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: '#e2e8f0', fontSize: 12 }}
                  stroke="#475569"
                  interval={0}
                  height={60}
                  tickFormatter={(value: string) => {
                    const words = value.split(' ');
                    return `${words[0]}\n${words.slice(1).join(' ')}`;
                  }}
                />
                <YAxis 
                  domain={[0, 100]} 
                  tick={{ fill: '#e2e8f0', fontSize: 12 }}
                  stroke="#475569"
                  width={45}
                  label={{ 
                    value: 'Score (%)', 
                    angle: -90, 
                    position: 'insideLeft',
                    fill: '#e2e8f0',
                    fontSize: 12,
                    offset: -5
                  }}
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
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
                      <div key={name}>
                        <p className="font-medium">{props.payload.description}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {getMetricContext(props.payload.name)}
                        </p>
                      </div>
                    ];
                  }}
                />
                <Bar 
                  dataKey="value" 
                  fill="#3b82f6"
                  name="Performance Score"
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
      return 'Marketing Effectiveness';
    case 'Automation Potential':
      return 'Automation Readiness';
    case 'ROI Potential':
      return 'ROI Opportunity';
    default:
      return name;
  }
};

const getMetricDescription = (name: string): string => {
  switch (name) {
    case 'Marketing Maturity':
      return 'Current level of marketing process efficiency';
    case 'Automation Potential':
      return 'Opportunities to implement automation';
    case 'ROI Potential':
      return 'Expected return on investment';
    default:
      return '';
  }
};

const getMetricContext = (name: string): string => {
  switch (name) {
    case 'Marketing Maturity':
      return 'Based on your current processes and team capabilities';
    case 'Automation Potential':
      return 'Areas where automation can improve efficiency';
    case 'ROI Potential':
      return 'Projected returns based on industry benchmarks';
    default:
      return '';
  }
};