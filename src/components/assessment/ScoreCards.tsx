import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { Info, Zap, Cog, GitBranch } from 'lucide-react';
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

const getIcon = (sectionTitle: string) => {
  switch (sectionTitle) {
    case "Process Details":
      return <GitBranch className="h-5 w-5 text-gold" />;
    case "Technology":
      return <Cog className="h-5 w-5 text-gold" />;
    case "Processes":
      return <Zap className="h-5 w-5 text-gold" />;
    default:
      return <Info className="h-5 w-5 text-gold" />;
  }
};

const getTooltipContent = (sectionTitle: string, score: number) => {
  const explanations: Record<string, { description: string; impact: string; }> = {
    "Process Details": {
      description: "Evaluates how well-documented and structured your current workflows are",
      impact: score >= 80 
        ? "Your processes are highly organized and prime for automation"
        : score >= 60
        ? "Good foundation, with clear opportunities for optimization"
        : "Significant potential for efficiency improvements through automation"
    },
    "Technology": {
      description: "Assesses your current tech stack's automation readiness",
      impact: score >= 80
        ? "Your systems are well-positioned for advanced automation integration"
        : score >= 60
        ? "Good technical foundation with room for strategic upgrades"
        : "Opportunities to modernize and integrate your technology stack"
    },
    "Processes": {
      description: "Measures the efficiency and standardization of your workflows",
      impact: score >= 80
        ? "Your workflows are optimized and ready for advanced automation"
        : score >= 60
        ? "Good standardization with clear automation opportunities"
        : "High potential for workflow optimization and automation"
    }
  };

  const content = explanations[sectionTitle];
  if (!content) return { description: "Section score based on assessment responses", impact: "" };
  return content;
};

export const SectionScoreCard: React.FC<{ title: string; score: number }> = ({ title, score }) => {
  const content = getTooltipContent(title, score);
  const icon = getIcon(title);

  return (
    <Card className="relative overflow-hidden">
      <div className={`absolute top-0 left-0 w-1 h-full ${
        score >= 80 ? 'bg-green-500' : 
        score >= 60 ? 'bg-gold' : 
        'bg-red-500'
      }`} />
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {icon}
            <h3 className="text-lg font-medium">{title}</h3>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs p-4 space-y-2">
                <p className="font-medium text-sm">{content.description}</p>
                <p className="text-sm text-muted-foreground">{content.impact}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="space-y-2">
          <p className="text-3xl font-bold">{score}%</p>
          <p className="text-sm text-muted-foreground">
            {score >= 80 ? 'Excellent' : 
             score >= 60 ? 'Good' : 
             'Needs Improvement'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};