import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';
import { useAssessment } from '@/contexts/AssessmentContext';

interface MarketingMetricsDisplayProps {
  metrics: {
    automationLevel: number;      // Percentage (0-100)
    potentialReduction: number;   // Decimal (0-1)
    conversionImprovement: number;// Percentage (0-100)
    automationROI: number;        // Percentage (0-300)
  };
  assessmentData?: {
    qualificationScore?: number;
    sections?: Record<string, { percentage: number }>;
  };
}

interface MetricItemProps {
  title: string;
  value: number;
  description: string;
  type: string;
}

const getMetricStatus = (value: number, metric: string): { label: string; color: string } => {
  // Ensure value is in percentage form (0-100)
  const normalizedValue = value > 1 ? value : value * 100;
  console.log('Getting metric status for:', { value: normalizedValue, metric });
  
  switch (metric) {
    case 'cac':
      if (normalizedValue >= 35) return { label: 'High Impact', color: 'bg-green-500/20' };
      if (normalizedValue >= 20) return { label: 'Medium Impact', color: 'bg-yellow-500/20' };
      return { label: 'Low Impact', color: 'bg-blue-500/20' };
    
    case 'automation':
      if (normalizedValue >= 70) return { label: 'Advanced', color: 'bg-green-500/20' };
      if (normalizedValue >= 40) return { label: 'Intermediate', color: 'bg-yellow-500/20' };
      return { label: 'Basic', color: 'bg-blue-500/20' };
    
    case 'conversion':
      if (normalizedValue >= 30) return { label: 'Excellent', color: 'bg-green-500/20' };
      if (normalizedValue >= 15) return { label: 'Good', color: 'bg-yellow-500/20' };
      return { label: 'Needs Improvement', color: 'bg-blue-500/20' };
    
    case 'roi':
      if (normalizedValue >= 200) return { label: 'Exceptional', color: 'bg-green-500/20' };
      if (normalizedValue >= 100) return { label: 'Good', color: 'bg-yellow-500/20' };
      return { label: 'Conservative', color: 'bg-blue-500/20' };
    
    default:
      return { label: 'Normal', color: 'bg-blue-500/20' };
  }
};

const MetricItem: React.FC<MetricItemProps> = ({ title, value, description, type }) => {
  // Ensure value is in percentage form for display
  const normalizedValue = value > 1 ? value : value * 100;
  const status = getMetricStatus(normalizedValue, type);
  
  console.log('MetricItem rendering:', { title, value: normalizedValue, type, status });
  
  return (
    <TooltipProvider>
      <div className="p-4 bg-muted/10 rounded-lg hover:bg-muted/20 transition-colors">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <h4 className="font-medium">{title}</h4>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-sm">{description}</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <Badge variant="secondary" className={`${status.color} text-foreground`}>
            {status.label}
          </Badge>
        </div>
        <p className="text-2xl font-bold">{normalizedValue.toFixed(1)}%</p>
      </div>
    </TooltipProvider>
  );
};

const METRIC_CONFIG = {
  automation: {
    title: 'Automation Level',
    description: 'Current level of marketing automation',
    type: 'automation'
  },
  cac: {
    title: 'CAC Reduction Potential',
    description: 'Potential reduction in customer acquisition cost',
    type: 'cac'
  },
  conversion: {
    title: 'Conversion Improvement',
    description: 'Projected improvement in conversion rates',
    type: 'conversion'
  },
  roi: {
    title: 'ROI Potential',
    description: 'Projected return on investment',
    type: 'roi'
  }
};

const METRIC_CONFIG = {
  automation: {
    title: 'Automation Level',
    description: 'Current level of marketing automation',
    type: 'automation'
  },
  cac: {
    title: 'CAC Reduction Potential',
    description: 'Potential reduction in customer acquisition cost',
    type: 'cac'
  },
  conversion: {
    title: 'Conversion Improvement',
    description: 'Projected improvement in conversion rates',
    type: 'conversion'
  },
  roi: {
    title: 'ROI Potential',
    description: 'Projected return on investment',
    type: 'roi'
  }
};

export const MarketingMetrics: React.FC<MarketingMetricsDisplayProps> = ({ metrics, assessmentData }) => {
  console.log('MarketingMetrics rendering with data:', { metrics, assessmentData });
  
  // Normalize all metrics to percentage form (0-100)
  const normalizedMetrics = {
    automation: metrics.automationLevel > 1 ? metrics.automationLevel : metrics.automationLevel * 100,
    cac: metrics.potentialReduction > 1 ? metrics.potentialReduction : metrics.potentialReduction * 100,
    conversion: metrics.conversionImprovement > 1 ? metrics.conversionImprovement : metrics.conversionImprovement * 100,
    roi: metrics.automationROI > 1 ? metrics.automationROI : metrics.automationROI * 100
  };

  console.log('Normalized metrics:', normalizedMetrics);

  return (
    <Card className="w-full">
      <CardContent className="grid grid-cols-2 gap-4 p-6">
        {Object.entries(METRIC_CONFIG).map(([key, config]) => (
          <MetricItem
            key={key}
            title={config.title}
            value={normalizedMetrics[key]}
            description={config.description}
            type={config.type}
          />
        ))}
      </CardContent>
    </Card>
  );
};

export { MetricItem };