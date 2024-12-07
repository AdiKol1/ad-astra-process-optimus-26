import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';
import { useAssessment } from '@/contexts/AssessmentContext';

interface MarketingMetricsProps {
  metrics: {
    cac: number;
    conversionRate: number;
    automationLevel: number;
    roiScore: number;
  };
}

const getMetricStatus = (value: number, metric: string): { label: string; color: string } => {
  console.log('Getting metric status for:', { value, metric });
  
  switch (metric) {
    case 'cac':
      if (value < 15) return { label: 'Low Priority', color: 'bg-blue-500' };
      if (value < 25) return { label: 'Medium Priority', color: 'bg-yellow-500' };
      return { label: 'High Priority', color: 'bg-red-500' };
    
    case 'automation':
      if (value < 30) return { label: 'Basic', color: 'bg-blue-500' };
      if (value < 60) return { label: 'Intermediate', color: 'bg-green-500' };
      return { label: 'Advanced', color: 'bg-purple-500' };
    
    case 'efficiency':
      if (value < 40) return { label: 'Improvement Needed', color: 'bg-yellow-500' };
      if (value < 70) return { label: 'Good', color: 'bg-green-500' };
      return { label: 'Excellent', color: 'bg-blue-500' };
    
    case 'roi':
      // Updated ROI thresholds to work with actual percentages
      if (value < 100) return { label: 'Conservative', color: 'bg-blue-500' };
      if (value < 200) return { label: 'Good', color: 'bg-green-500' };
      return { label: 'Optimized', color: 'bg-green-500' };
    
    default:
      return { label: 'Normal', color: 'bg-blue-500' };
  }
};

const MetricItem: React.FC<{
  title: string;
  value: number;
  description: string;
  type: string;
}> = ({ title, value, description, type }) => {
  const status = getMetricStatus(value, type);
  console.log('MetricItem rendering:', { title, value, type, status });
  
  // Format ROI as percentage with proper decimal places
  const displayValue = type === 'roi' 
    ? `${(value).toFixed(1)}%`
    : `${value.toFixed(1)}%`;
  
  return (
    <div className="p-3 bg-muted/50 rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{title}</span>
          <Tooltip>
            <TooltipTrigger>
              <Info className="h-4 w-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">{description}</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <Badge className={status.color}>
          {status.label}
        </Badge>
      </div>
      <p className="text-2xl font-bold mb-1">
        {displayValue}
      </p>
      <p className="text-xs text-muted-foreground">
        {value > 0 ? 'potential improvement' : 'baseline measurement'}
      </p>
    </div>
  );
};

export const MarketingMetrics: React.FC<MarketingMetricsProps> = ({ metrics }) => {
  const { assessmentData } = useAssessment();
  console.log('MarketingMetrics rendering with data:', { metrics, assessmentData });

  // Normalize ROI to percentage
  const normalizedMetrics = {
    ...metrics,
    roiScore: metrics.roiScore * 100 // Convert to percentage
  };

  return (
    <TooltipProvider>
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Automation Impact Assessment</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Analysis of potential improvements through automation
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <MetricItem
                title="Automation Level"
                value={metrics.automationLevel}
                description="Current level of process automation"
                type="automation"
              />
              <MetricItem
                title="CAC Reduction Potential"
                value={assessmentData?.scores?.cac?.potentialReduction || 0}
                description="Potential reduction in customer acquisition costs"
                type="cac"
              />
            </div>
            <div className="space-y-4">
              <MetricItem
                title="Efficiency Score"
                value={metrics.automationLevel}
                description="Overall process efficiency rating"
                type="efficiency"
              />
              <MetricItem
                title="ROI Potential"
                value={normalizedMetrics.roiScore}
                description="Expected return on investment"
                type="roi"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};