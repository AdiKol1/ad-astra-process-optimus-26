import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface MetricScoreCardProps {
  title: string;
  value: string | number;
  suffix?: string;
  description?: string;
}

export const MetricScoreCard: React.FC<MetricScoreCardProps> = ({ 
  title, 
  value,
  suffix = '%',
  description 
}) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-white">{title}</h3>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">{description || 'Score calculated based on assessment responses and industry benchmarks'}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <p className="text-3xl font-bold text-white">
          {value}{suffix}
        </p>
      </CardContent>
    </Card>
  );
};