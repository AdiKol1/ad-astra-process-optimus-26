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