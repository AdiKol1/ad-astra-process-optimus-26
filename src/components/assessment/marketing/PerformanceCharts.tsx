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
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: '#FDB813' }}
                  stroke="#FDB813"
                />
                <YAxis 
                  domain={[0, 100]} 
                  tick={{ fill: '#FDB813' }}
                  stroke="#FDB813"
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1E293B',
                    border: '1px solid #FDB813',
                    borderRadius: '8px'
                  }}
                  labelStyle={{ color: '#FDB813' }}
                  itemStyle={{ color: '#FDB813' }}
                />
                <Legend 
                  wrapperStyle={{ color: '#FDB813' }}
                />
                <Bar 
                  dataKey="value" 
                  fill="#FDB813" 
                  name="Performance Score"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};