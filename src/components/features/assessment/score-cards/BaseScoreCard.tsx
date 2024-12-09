import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface BaseCardProps {
  title: string;
  value: number | string;
  suffix?: string;
  tooltipContent?: string;
}

export const BaseScoreCard: React.FC<BaseCardProps> = ({ 
  title, 
  value, 
  suffix = '%',
  tooltipContent
}) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-white">{title}</h3>
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
      <p className="text-3xl font-bold text-white">
        {value}{suffix}
      </p>
    </CardContent>
  </Card>
);