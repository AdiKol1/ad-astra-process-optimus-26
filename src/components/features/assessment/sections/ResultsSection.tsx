import React, { useEffect } from 'react';
import type { StepComponentProps } from '@/types/assessment/components';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ErrorBoundary } from '@/components/error/ErrorBoundary';
import { LoadingState } from '@/components/ui/loading-state';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface MetricsData {
  efficiency: {
    current: number;
    potential: number;
    improvement: number;
    automationScore: number;
  };
  cost: {
    current: number;
    projected: number;
    savings: number;
    paybackPeriod: number;
  };
  roi: {
    oneYear: number;
    threeYear: number;
    fiveYear: number;
  };
}

interface AssessmentResults {
  metrics: MetricsData;
  recommendations: {
    automationOpportunities: Array<{
      process: string;
      potentialSavings: number;
      complexity: string;
      priority: string;
    }>;
  };
  summary: {
    overview: string;
    keyFindings: string[];
    nextSteps: string[];
  };
}

const ResultsSection: React.FC<StepComponentProps> = ({
  onComplete,
  onValidationChange,
  isLoading,
  metadata,
  responses
}) => {
  // Results are always valid since this is a display-only section
  useEffect(() => {
    onValidationChange?.(true);
  }, [onValidationChange]);

  const results = responses?.results as AssessmentResults;

  if (!results) {
    return (
      <LoadingState isLoading={true}>
        <div className="h-96 flex items-center justify-center">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-3/4 mx-auto"></div>
            <div className="h-4 bg-muted rounded w-1/2 mx-auto"></div>
          </div>
        </div>
      </LoadingState>
    );
  }

  const { metrics, recommendations, summary } = results;

  const efficiencyData = [
    { name: 'Current', value: metrics.efficiency.current * 100 },
    { name: 'Potential', value: metrics.efficiency.potential * 100 }
  ];

  const roiData = [
    { name: '1 Year', value: metrics.roi.oneYear },
    { name: '3 Year', value: metrics.roi.threeYear },
    { name: '5 Year', value: metrics.roi.fiveYear }
  ];

  return (
    <ErrorBoundary>
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold tracking-tight text-center">
          {metadata.title}
        </h2>
        <p className="mt-2 text-lg text-muted-foreground text-center">
          {metadata.description}
        </p>

        {/* Overview Card */}
        <Card className="mt-8 p-6">
          <h3 className="text-xl font-semibold mb-4">Assessment Overview</h3>
          <p className="text-muted-foreground">{summary.overview}</p>
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <p className="text-sm font-medium">Efficiency Improvement</p>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold text-primary">
                  {metrics.efficiency.improvement.toFixed(1)}%
                </span>
                <span className="text-sm text-muted-foreground">potential increase</span>
              </div>
              <Progress 
                value={metrics.efficiency.improvement} 
                className="h-2"
              />
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">Annual Savings</p>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold text-primary">
                  ${metrics.cost.savings.toLocaleString()}
                </span>
                <span className="text-sm text-muted-foreground">per year</span>
              </div>
              <Progress 
                value={(metrics.cost.savings / metrics.cost.current) * 100} 
                className="h-2"
              />
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">ROI Potential</p>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold text-primary">
                  {metrics.roi.threeYear}%
                </span>
                <span className="text-sm text-muted-foreground">3-year return</span>
              </div>
              <Progress 
                value={Math.min(metrics.roi.threeYear, 100)} 
                className="h-2"
              />
            </div>
          </div>
        </Card>

        {/* Detailed Analysis */}
        <Tabs defaultValue="efficiency" className="mt-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="efficiency">Efficiency Analysis</TabsTrigger>
            <TabsTrigger value="roi">ROI Analysis</TabsTrigger>
            <TabsTrigger value="next-steps">Next Steps</TabsTrigger>
          </TabsList>

          <TabsContent value="efficiency" className="mt-4">
            <Card className="p-6">
              <h4 className="text-lg font-semibold mb-4">Process Efficiency</h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={efficiencyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis unit="%" />
                    <Tooltip />
                    <Bar dataKey="value" fill="var(--primary)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="roi" className="mt-4">
            <Card className="p-6">
              <h4 className="text-lg font-semibold mb-4">Return on Investment</h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={roiData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis unit="%" />
                    <Tooltip />
                    <Bar dataKey="value" fill="var(--primary)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="next-steps" className="mt-4">
            <Card className="p-6">
              <h4 className="text-lg font-semibold mb-4">Key Findings</h4>
              <ul className="space-y-2">
                {summary.keyFindings.map((finding, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2">•</span>
                    <span className="text-muted-foreground">{finding}</span>
                  </li>
                ))}
              </ul>

              <h4 className="text-lg font-semibold mt-8 mb-4">Recommended Next Steps</h4>
              <div className="space-y-4">
                {summary.nextSteps.map((step, index) => (
                  <div key={index} className="flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                      <span className="text-sm font-medium">{index + 1}</span>
                    </div>
                    <p className="text-muted-foreground">{step}</p>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Navigation */}
        <div className="mt-8 flex justify-end">
          <Button
            onClick={onComplete}
            disabled={isLoading}
          >
            Complete Assessment
          </Button>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default ResultsSection;
