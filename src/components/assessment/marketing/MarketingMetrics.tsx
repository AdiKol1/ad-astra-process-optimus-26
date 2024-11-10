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
  const getMetricStatus = (value: number) => {
    if (value >= 80) return { label: 'High Potential', color: 'bg-green-500' };
    if (value >= 60) return { label: 'Good Potential', color: 'bg-blue-500' };
    if (value >= 40) return { label: 'Moderate Potential', color: 'bg-yellow-500' };
    return { label: 'High Priority', color: 'bg-red-500' };
  };

  const metricDescriptions = {
    cac: "Potential reduction in customer acquisition costs through automation",
    conversionRate: "Expected improvement in conversion rates with automated workflows",
    automationLevel: "Current automation maturity and room for improvement",
    roi: "Projected return on investment from automation implementation"
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
                  <Badge className={getMetricStatus(metrics.cac).color}>
                    {getMetricStatus(metrics.cac).label}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {metrics.cac}% potential for cost optimization
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
                  <Badge className={getMetricStatus(metrics.conversionRate).color}>
                    {getMetricStatus(metrics.conversionRate).label}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {metrics.conversionRate}% potential increase in conversion rates
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
                  <Badge className={getMetricStatus(metrics.automationLevel).color}>
                    {getMetricStatus(metrics.automationLevel).label}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {metrics.automationLevel}% current automation level
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
                  <Badge className={getMetricStatus(metrics.roiScore).color}>
                    {getMetricStatus(metrics.roiScore).label}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {metrics.roiScore}% expected return on investment
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};