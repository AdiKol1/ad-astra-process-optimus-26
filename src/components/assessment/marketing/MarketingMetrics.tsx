import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';

interface MarketingMetricsProps {
  metrics: {
    cac: number;
    conversionRate: number;
    automationLevel: number;
    roiScore: number;
  };
}

export const MarketingMetrics: React.FC<MarketingMetricsProps> = ({ metrics }) => {
  const getMetricStatus = (value: number, isOpportunity: boolean = false) => {
    if (isOpportunity) {
      // For opportunity metrics (CAC reduction & conversion improvement)
      // Even small improvement opportunities should be highlighted
      if (value >= 15) return { label: 'High Priority', color: 'bg-red-500' };
      if (value >= 10) return { label: 'Medium Priority', color: 'bg-yellow-500' };
      if (value >= 5) return { label: 'Low Priority', color: 'bg-blue-500' };
      return { label: 'Optimized', color: 'bg-green-500' };
    } else {
      // For current state metrics (automation level & ROI)
      if (value >= 80) return { label: 'Optimized', color: 'bg-green-500' };
      if (value >= 60) return { label: 'Good', color: 'bg-blue-500' };
      if (value >= 40) return { label: 'Needs Attention', color: 'bg-yellow-500' };
      return { label: 'Action Required', color: 'bg-red-500' };
    }
  };

  const metricDescriptions = {
    cac: "Potential reduction in customer acquisition costs through automation",
    conversionRate: "Expected improvement in conversion rates with automated workflows",
    automationLevel: "Current automation maturity and room for improvement",
    roi: "Projected return on investment from automation implementation"
  };

  // Ensure metrics have minimum values and interpret them correctly
  const normalizedMetrics = {
    cac: Math.max(metrics.cac, 15), // Minimum 15% potential reduction
    conversionRate: Math.max(metrics.conversionRate, 20), // Minimum 20% potential improvement
    automationLevel: Math.max(metrics.automationLevel, 10), // Minimum 10% automation level
    roiScore: Math.max(metrics.roiScore, 25) // Minimum 25% ROI potential
  };

  return (
    <TooltipProvider>
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Automation Impact Assessment</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Analysis of potential improvements through marketing automation
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">CAC Reduction Potential</span>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>{metricDescriptions.cac}</TooltipContent>
                    </Tooltip>
                  </div>
                  <Badge className={getMetricStatus(normalizedMetrics.cac, true).color}>
                    {getMetricStatus(normalizedMetrics.cac, true).label}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {normalizedMetrics.cac}% potential for cost optimization
                </p>
              </div>

              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Conversion Improvement</span>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>{metricDescriptions.conversionRate}</TooltipContent>
                    </Tooltip>
                  </div>
                  <Badge className={getMetricStatus(normalizedMetrics.conversionRate, true).color}>
                    {getMetricStatus(normalizedMetrics.conversionRate, true).label}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {normalizedMetrics.conversionRate}% potential increase in conversion rates
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Automation Maturity</span>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>{metricDescriptions.automationLevel}</TooltipContent>
                    </Tooltip>
                  </div>
                  <Badge className={getMetricStatus(normalizedMetrics.automationLevel).color}>
                    {getMetricStatus(normalizedMetrics.automationLevel).label}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {normalizedMetrics.automationLevel}% current automation level
                </p>
              </div>

              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">ROI Potential</span>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>{metricDescriptions.roi}</TooltipContent>
                    </Tooltip>
                  </div>
                  <Badge className={getMetricStatus(normalizedMetrics.roiScore).color}>
                    {getMetricStatus(normalizedMetrics.roiScore).label}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {normalizedMetrics.roiScore}% expected return on investment
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};