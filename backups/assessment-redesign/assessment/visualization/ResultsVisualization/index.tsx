import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Info } from 'lucide-react';
import { ErrorBoundary } from '@/components/error/ErrorBoundary';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip
} from 'recharts';
import type { ResultsVisualizationProps } from '@/types/assessment';

const RadarChartComponent: React.FC<{ data: Array<{ category: string; value: number }> }> = ({ data }) => (
  <ResponsiveContainer width="100%" height="100%">
    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
      <PolarGrid />
      <PolarAngleAxis dataKey="category" />
      <PolarRadiusAxis angle={30} domain={[0, 100]} />
      <Radar
        name="Score"
        dataKey="value"
        stroke="#2563eb"
        fill="#3b82f6"
        fillOpacity={0.6}
      />
      <Tooltip />
    </RadarChart>
  </ResponsiveContainer>
);

export const ResultsVisualization: React.FC<ResultsVisualizationProps> = ({ scores }) => {
  const data = React.useMemo(() => [
    { category: 'Process', value: scores.process },
    { category: 'Technology', value: scores.technology },
    { category: 'Team', value: scores.team }
  ], [scores]);

  return (
    <ErrorBoundary>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Assessment Results</CardTitle>
          <CardDescription>
            Your organization's performance across key areas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full h-[400px]">
            <RadarChartComponent data={data} />
          </div>
          <div className="grid grid-cols-3 gap-4 mt-6">
            {data.map(({ category, value }) => (
              <div key={category} className="text-center">
                <h3 className="text-lg font-semibold">{category}</h3>
                <p className="text-2xl font-bold text-blue-600">{value}%</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </ErrorBoundary>
  );
};