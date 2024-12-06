import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';
import {
  calculateAutomationLevel,
  calculateCACReduction,
  calculateConversionImprovement,
  calculateROI
} from '@/utils/industryStandards';

interface MarketingMetricsProps {
  metrics: {
    cac: number;
    conversionRate: number;
    automationLevel: number;
    roiScore: number;
  };
}

export const MarketingMetrics: React.FC<MarketingMetricsProps> = ({ metrics }) => {
  // Get data from assessment context or props
  const industry = "Real Estate"; // This should come from context
  const currentTools = ["Spreadsheets/Manual tracking"]; // This should come from context
  const employeeCount = 1; // This should come from context
  const processVolume = "100-500"; // This should come from context

  // Calculate realistic metrics
  const automationLevel = calculateAutomationLevel(industry, currentTools, employeeCount);
  const cacReduction = calculateCACReduction(automationLevel, industry);
  const conversionImprovement = calculateConversionImprovement(automationLevel, industry);
  const roi = calculateROI(industry, automationLevel, processVolume);

  console.log('Marketing Metrics - Calculated:', {
    automationLevel,
    cacReduction,
    conversionImprovement,
    roi
  });

  const getMetricStatus = (value: number, metric: string): { label: string; color: string } => {
    switch (metric) {
      case 'automation':
        if (value < 20) return { label: 'Needs Attention', color: 'bg-yellow-500' };
        if (value < 35) return { label: 'Good', color: 'bg-blue-500' };
        return { label: 'Optimized', color: 'bg-green-500' };
      
      case 'reduction':
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
              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">CAC Reduction Potential</span>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">
                          Potential reduction in customer acquisition costs through automation.
                          Based on industry benchmarks and current automation level.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Badge className={getMetricStatus(cacReduction, 'reduction').color}>
                    {getMetricStatus(cacReduction, 'reduction').label}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {cacReduction}% potential for cost optimization
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
                      <TooltipContent>
                        <p className="max-w-xs">
                          Expected improvement in conversion rates with automated workflows.
                          Based on current processes and industry averages.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Badge className={getMetricStatus(conversionImprovement, 'reduction').color}>
                    {getMetricStatus(conversionImprovement, 'reduction').label}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {conversionImprovement}% potential increase in conversion rates
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
                      <TooltipContent>
                        <p className="max-w-xs">
                          Current automation maturity level based on implemented
                          processes and technologies.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Badge className={getMetricStatus(automationLevel, 'automation').color}>
                    {getMetricStatus(automationLevel, 'automation').label}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {automationLevel}% current automation level
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
                      <TooltipContent>
                        <p className="max-w-xs">
                          Projected return on investment based on implementation
                          costs and expected savings. Includes direct and indirect benefits.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Badge className={getMetricStatus(roi, 'roi').color}>
                    {getMetricStatus(roi, 'roi').label}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {roi}% expected return on investment (first year)
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};
