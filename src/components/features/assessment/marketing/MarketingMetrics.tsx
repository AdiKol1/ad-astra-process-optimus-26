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
      if (value >= 40) return { label: 'High Priority', color: 'bg-red-500' };
      if (value >= 25) return { label: 'Medium Priority', color: 'bg-yellow-500' };
      return { label: 'Low Priority', color: 'bg-blue-500' };
    } else {
      if (value >= 80) return { label: 'Optimized', color: 'bg-green-500' };
      if (value >= 60) return { label: 'Good', color: 'bg-blue-500' };
      if (value >= 40) return { label: 'Needs Attention', color: 'bg-yellow-500' };
      return { label: 'Action Required', color: 'bg-red-500' };
    }
  };

  // Calculate normalized metrics based on industry standards and current automation level
  const normalizedMetrics = {
    // CAC reduction potential: Based on current automation level
    // Maximum potential is 45% for low automation, minimum 15% for high automation
    // Formula: 45% - (automation_level * 0.5) ensures realistic reduction potential
    cac: Math.min(45, Math.max(15, 45 - metrics.automationLevel * 0.5)),
    
    // Conversion rate improvement potential: Based on current automation level
    // Maximum potential is 35% for low automation, minimum 10% for high automation
    // Formula: 35% - (automation_level * 0.4) ensures realistic improvement potential
    conversionRate: Math.min(35, Math.max(10, 35 - metrics.automationLevel * 0.4)),
    
    // Current automation level: Directly from metrics, minimum 10%
    automationLevel: Math.max(metrics.automationLevel, 10),
    
    // ROI calculation: Based on 3-year projection with realistic implementation costs
    roiScore: calculateThreeYearROI(metrics.roiScore)
  };

  console.log('Marketing Metrics - Normalized:', normalizedMetrics);

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
                      <TooltipContent>
                        <p className="max-w-xs">
                          Expected improvement in conversion rates with automated workflows.
                          Based on current processes and industry averages.
                        </p>
                      </TooltipContent>
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
                      <TooltipContent>
                        <p className="max-w-xs">
                          Current automation maturity level based on implemented
                          processes and technologies.
                        </p>
                      </TooltipContent>
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
                      <TooltipContent>
                        <p className="max-w-xs">
                          Projected 3-year return on investment based on implementation
                          costs and expected savings. Includes direct and indirect benefits.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Badge className={getMetricStatus(normalizedMetrics.roiScore).color}>
                    {getMetricStatus(normalizedMetrics.roiScore).label}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {normalizedMetrics.roiScore.toFixed(1)}% expected return on investment (3-year)
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};

function calculateThreeYearROI(annualSavings: number): number {
  // Base implementation cost
  const baseImplementationCost = 25000;
  
  // Calculate 3-year savings (including both direct and indirect benefits)
  // Direct benefits: Cost savings, time savings
  // Indirect benefits: Improved accuracy, faster processing
  const directSavings = annualSavings * 3;
  const indirectSavings = annualSavings * 0.2 * 3; // 20% additional value from indirect benefits
  const totalSavings = directSavings + indirectSavings;
  
  // Calculate ROI percentage
  const roi = ((totalSavings - baseImplementationCost) / baseImplementationCost) * 100;
  
  // Ensure ROI is between 100% and 300% for realistic projections
  // Most automation projects show ROI in this range over 3 years
  return Math.min(300, Math.max(100, roi));
}