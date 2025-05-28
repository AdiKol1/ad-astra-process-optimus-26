import React, { useEffect, useState } from 'react';
import type { AssessmentSectionProps } from '@/components/features/assessment/core/AssessmentFlow/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ErrorBoundary } from '@/components/error/ErrorBoundary';
import { LoadingState } from '@/components/ui/loading-state';
import { CheckCircle, Download, FileText, ArrowRight } from 'lucide-react';

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

interface RecommendationsData {
  automationOpportunities: Array<{
    process: string;
    potentialSavings: number;
    complexity: string;
    priority: string;
  }>;
  processImprovements: Array<{
    area: string;
    recommendation: string;
    impact: string;
  }>;
  toolRecommendations: Array<{
    name: string;
    purpose: string;
    benefits: string[];
  }>;
}

interface ResultsSummary {
  overview: string;
  keyFindings: string[];
  nextSteps: string[];
}

interface AssessmentResults {
  metrics: MetricsData;
  recommendations: RecommendationsData;
  summary: ResultsSummary;
}

const CompleteStep: React.FC<AssessmentSectionProps> = ({
  onValidationChange,
  onNext,
  isLoading,
  responses,
  metadata
}) => {
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const results = responses?.results as AssessmentResults;

  // Always valid since this is a completion screen
  useEffect(() => {
    onValidationChange(true);
  }, [onValidationChange]);

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

  const handleDownloadReport = async () => {
    try {
      setIsGeneratingReport(true);
      // TODO: Implement report generation service call
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulated delay
      setIsGeneratingReport(false);
    } catch (error) {
      console.error('Failed to generate report:', error);
      setIsGeneratingReport(false);
    }
  };

  const handleViewDashboard = () => {
    if (onNext) {
      onNext();
    }
  };

  return (
    <ErrorBoundary>
      <div className="max-w-6xl mx-auto">
        {/* Success Header */}
        <div className="text-center">
          <div className="flex justify-center mb-8">
            <CheckCircle className="h-16 w-16 text-primary" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight">
            {metadata.title}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            {metadata.description}
          </p>
        </div>

        {/* Summary Cards */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6">
            <h3 className="font-semibold mb-2">Efficiency Improvement</h3>
            <div className="space-y-2">
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-bold text-primary">
                  {metrics.efficiency.improvement.toFixed(1)}%
                </span>
                <span className="text-sm text-muted-foreground">Potential Increase</span>
              </div>
              <Progress value={metrics.efficiency.improvement} className="h-2" />
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-2">Annual Cost Savings</h3>
            <div className="space-y-2">
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-bold text-primary">
                  ${metrics.cost.savings.toLocaleString()}
                </span>
                <span className="text-sm text-muted-foreground">per year</span>
              </div>
              <Progress 
                value={(metrics.cost.savings / metrics.cost.current) * 100} 
                className="h-2" 
              />
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-2">ROI Potential</h3>
            <div className="space-y-2">
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-bold text-primary">
                  {metrics.roi.threeYear}%
                </span>
                <span className="text-sm text-muted-foreground">3-Year Return</span>
              </div>
              <Progress 
                value={Math.min(metrics.roi.threeYear, 100)} 
                className="h-2" 
              />
            </div>
          </Card>
        </div>

        {/* Key Findings & Next Steps */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Key Findings</h3>
            <ul className="space-y-4">
              {summary.keyFindings.map((finding, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-medium text-primary">{index + 1}</span>
                  </div>
                  <span className="text-muted-foreground">{finding}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Recommended Next Steps</h3>
            <ul className="space-y-4">
              {summary.nextSteps.map((step, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-medium text-primary">{index + 1}</span>
                  </div>
                  <span className="text-muted-foreground">{step}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {/* Priority Recommendations */}
        <Card className="mt-12 p-6">
          <h3 className="text-xl font-semibold mb-6">Priority Automation Opportunities</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.automationOpportunities
              .filter(opp => opp.priority === 'High')
              .slice(0, 3)
              .map((opp, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <h4 className="font-medium">{opp.process}</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Potential Savings: ${opp.potentialSavings.toLocaleString()}
                  </p>
                  <div className="flex gap-2 mt-2">
                    <span className="text-xs px-2 py-1 rounded-full bg-primary/10">
                      {opp.complexity} Complexity
                    </span>
                    <span className="text-xs px-2 py-1 rounded-full bg-primary/10">
                      High Priority
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="mt-12 flex flex-col sm:flex-row justify-center gap-4">
          <Button
            size="lg"
            className="min-w-[200px]"
            onClick={handleDownloadReport}
            disabled={isGeneratingReport}
          >
            {isGeneratingReport ? (
              'Generating Report...'
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Download Report
              </>
            )}
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="min-w-[200px]"
            onClick={handleViewDashboard}
          >
            <FileText className="mr-2 h-4 w-4" />
            View Dashboard
          </Button>
        </div>

        {/* Support Information */}
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            Need assistance implementing these recommendations?{' '}
            <a href="/contact" className="text-primary hover:underline">
              Schedule a consultation
            </a>
            {' '}with our process optimization experts.
          </p>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default CompleteStep; 