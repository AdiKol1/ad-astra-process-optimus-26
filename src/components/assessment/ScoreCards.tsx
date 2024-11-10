import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { Info, Zap, Cog, GitBranch, Clock, DollarSign, TrendingUp } from 'lucide-react';
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

const getBenefits = (sectionTitle: string) => {
  const benefits: Record<string, { time: string; cost: string; growth: string }> = {
    "Process Details": {
      time: "Reduce manual work by 70%",
      cost: "Cut operational costs by 40%",
      growth: "Scale operations 3x faster"
    },
    "Technology": {
      time: "Automate 80% of tasks",
      cost: "Reduce tech overhead by 50%",
      growth: "10x faster processing speed"
    },
    "Processes": {
      time: "Save 30+ hours weekly",
      cost: "Minimize errors by 90%",
      growth: "Double team productivity"
    }
  };
  return benefits[sectionTitle] || { time: "", cost: "", growth: "" };
};

const getTooltipContent = (sectionTitle: string, score: number) => {
  const explanations: Record<string, { description: string; impact: string }> = {
    "Process Details": {
      description: "Evaluates your workflow automation potential",
      impact: score >= 80 
        ? "Your processes are ready for immediate automation benefits"
        : score >= 60
        ? "Quick wins available through targeted automation"
        : "Major ROI potential through process transformation"
    },
    "Technology": {
      description: "Measures your tech stack's automation readiness",
      impact: score >= 80
        ? "Ideal setup for advanced AI/automation integration"
        : score >= 60
        ? "Strategic upgrades will unlock automation potential"
        : "Technology modernization will drive massive gains"
    },
    "Processes": {
      description: "Analyzes workflow efficiency opportunities",
      impact: score >= 80
        ? "Ready for enterprise-grade automation solutions"
        : score >= 60
        ? "Clear path to optimization through automation"
        : "Significant optimization potential identified"
    }
  };

  const content = explanations[sectionTitle];
  if (!content) return { description: "Section score based on assessment responses", impact: "" };
  return content;
};

export const SectionScoreCard: React.FC<{ title: string; score: number }> = ({ title, score }) => {
  const content = getTooltipContent(title, score);
  const icon = getIcon(title);
  const benefits = getBenefits(title);

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
        
        <div className="space-y-4">
          <div>
            <p className="text-3xl font-bold">{score}%</p>
            <p className="text-sm text-muted-foreground">
              {score >= 80 ? 'Excellent' : 
               score >= 60 ? 'Good' : 
               'Needs Improvement'}
            </p>
          </div>

          <div className="space-y-2 pt-4 border-t">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-blue-500" />
              <span>{benefits.time}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <DollarSign className="h-4 w-4 text-green-500" />
              <span>{benefits.cost}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="h-4 w-4 text-gold" />
              <span>{benefits.growth}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};