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
  switch (metric) {
    case 'automation':
      if (value > 70) return { label: 'High Potential', color: 'bg-green-500' };
      if (value > 40) return { label: 'Medium Potential', color: 'bg-yellow-500' };
      return { label: 'Low Potential', color: 'bg-blue-500' };
    
    case 'efficiency':
      if (value > 60) return { label: 'Significant Gains', color: 'bg-green-500' };
      if (value > 30) return { label: 'Moderate Gains', color: 'bg-yellow-500' };
      return { label: 'Minor Gains', color: 'bg-blue-500' };
    
    case 'roi':
      if (value > 200) return { label: 'Exceptional ROI', color: 'bg-green-500' };
      if (value > 100) return { label: 'Good ROI', color: 'bg-yellow-500' };
      return { label: 'Positive ROI', color: 'bg-blue-500' };
    
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
  
  return (
    <div className="p-3 bg-muted/50 rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{title}</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">{description}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Badge className={status.color}>
          {status.label}
        </Badge>
      </div>
      <p className="text-2xl font-bold mb-1">
        {value.toFixed(1)}%
      </p>
      <p className="text-xs text-muted-foreground">
        potential improvement
      </p>
    </div>
  );
};

export const MarketingMetrics: React.FC<MarketingMetricsProps> = ({ metrics }) => {
  console.log('MarketingMetrics rendering with metrics:', metrics);

  return (
    <TooltipProvider>
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Automation Impact Assessment</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Analysis of potential improvements through automation
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <MetricItem
              title="Automation Level"
              value={metrics.automationLevel}
              description="Potential increase in process automation"
              type="automation"
            />
            <MetricItem
              title="CAC Reduction"
              value={metrics.conversionRate}
              description="Potential reduction in customer acquisition costs"
              type="efficiency"
            />
            <MetricItem
              title="Efficiency Score"
              value={metrics.automationLevel}
              description="Overall process efficiency improvement potential"
              type="efficiency"
            />
            <MetricItem
              title="ROI Potential"
              value={metrics.roiScore}
              description="Expected return on automation investment"
              type="roi"
            />
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};