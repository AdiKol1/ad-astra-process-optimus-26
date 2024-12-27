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
  description: string;
  tooltipContent?: string;
}

export const MetricScoreCard: React.FC<MetricScoreCardProps> = ({
  title,
  value,
  description,
  tooltipContent
}) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        {tooltipContent && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">{tooltipContent}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      <p className="text-3xl font-bold text-white mb-2">{value}</p>
      <p className="text-sm text-white/80">{description}</p>
    </CardContent>
  </Card>
);