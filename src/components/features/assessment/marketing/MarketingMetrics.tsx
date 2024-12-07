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

export const MarketingMetrics: React.FC<MarketingMetricsProps> = ({ metrics }) => {
  const { assessmentData } = useAssessment();
  console.log('MarketingMetrics rendering with data:', { metrics, assessmentData });

  const getMetricStatus = (value: number, metric: string) => {
    switch (metric) {
      case 'cac':
        if (value < 15) return { label: 'Low Priority', color: 'bg-blue-500' };
        if (value < 25) return { label: 'Medium Priority', color: 'bg-yellow-500' };
        return { label: 'High Priority', color: 'bg-red-500' };
      
      case 'roi':
        if (value < 50) return { label: 'Conservative', color: 'bg-blue-500' };
        if (value < 100) return { label: 'Good', color: 'bg-green-500' };
        return { label: 'Optimized', color: 'bg-green-500' };
      
      default:
        return { label: 'Normal', color: 'bg-blue-500' };
    }
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
                title="CAC Reduction Potential"
                value={assessmentData?.scores?.cac?.potentialReduction || 0}
                description="Potential reduction in customer acquisition costs"
                type="cac"
              />
              <MetricItem
                title="ROI Potential"
                value={assessmentData?.scores?.cac?.automationROI || 0}
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
      <p className="text-xs text-muted-foreground">
        {value}% potential improvement
      </p>
    </div>
  );
};
