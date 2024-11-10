import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface BaseCardProps {
  title: string;
  value: number;
  suffix?: string;
}

export const ScoreCard: React.FC<BaseCardProps> = ({ title, value, suffix = '%' }) => (
  <Card>
    <CardContent className="p-6">
      <h3 className="text-sm font-medium text-muted-foreground mb-2">{title}</h3>
      <p className="text-3xl font-bold">
        {value}
        {suffix}
      </p>
    </CardContent>
  </Card>
);

export const SavingsCard: React.FC<BaseCardProps> = ({ title, value }) => (
  <Card>
    <CardContent className="p-6">
      <h3 className="text-sm font-medium text-muted-foreground mb-2">{title}</h3>
      <p className="text-3xl font-bold">
        {formatCurrency(value)}
      </p>
    </CardContent>
  </Card>
);

export const EfficiencyCard: React.FC<BaseCardProps> = ({ title, value }) => (
  <Card>
    <CardContent className="p-6">
      <h3 className="text-sm font-medium text-muted-foreground mb-2">{title}</h3>
      <p className="text-3xl font-bold">
        {value}%
      </p>
    </CardContent>
  </Card>
);

export const SectionScoreCard: React.FC<{ title: string; score: number }> = ({ title, score }) => {
  const getTooltipContent = (sectionTitle: string) => {
    const explanations: Record<string, string> = {
      "Process Details": "This score reflects how well-structured and documented your current processes are. A high score (80%) indicates your processes are well-defined and ready for optimization.",
      "Technology": "Evaluates your current technology stack and its readiness for automation integration.",
      "Processes": "Measures the efficiency and standardization of your existing workflows."
    };
    return explanations[sectionTitle] || "Section score based on assessment responses";
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-2">
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>{getTooltipContent(title)}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <p className="text-3xl font-bold">{score}%</p>
      </CardContent>
    </Card>
  );
};
