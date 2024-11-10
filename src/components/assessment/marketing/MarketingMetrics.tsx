import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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
    if (value >= 80) return { label: 'Excellent', color: 'bg-green-500' };
    if (value >= 60) return { label: 'Good', color: 'bg-blue-500' };
    if (value >= 40) return { label: 'Fair', color: 'bg-yellow-500' };
    return { label: 'Needs Improvement', color: 'bg-red-500' };
  };

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4">Marketing Performance Metrics</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Customer Acquisition Cost</span>
              <Badge className={getMetricStatus(metrics.cac).color}>
                {getMetricStatus(metrics.cac).label}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Conversion Rate</span>
              <Badge className={getMetricStatus(metrics.conversionRate).color}>
                {getMetricStatus(metrics.conversionRate).label}
              </Badge>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Automation Level</span>
              <Badge className={getMetricStatus(metrics.automationLevel).color}>
                {getMetricStatus(metrics.automationLevel).label}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Marketing ROI</span>
              <Badge className={getMetricStatus(metrics.roiScore).color}>
                {getMetricStatus(metrics.roiScore).label}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};