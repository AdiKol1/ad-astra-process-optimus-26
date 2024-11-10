import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { Clock, DollarSign, Info, TrendingUp } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getIcon, getBenefits, getSectionExplanation, getTooltipContent } from './scorecard-utils';

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
  const content = getTooltipContent(title, score);
  const Icon = getIcon(title);
  const benefits = getBenefits(title);
  const explanation = getSectionExplanation(title);

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
            <Icon className="h-5 w-5 text-gold" />
            <div>
              <h3 className="text-lg font-medium text-white">{title}</h3>
              <p className="text-sm text-white/80">{explanation.title}</p>
            </div>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-white/60 cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs p-4 space-y-2">
                <p className="font-medium text-sm">{content.description}</p>
                <p className="text-sm text-white/80">{content.impact}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <div className="space-y-4">
          <div>
            <p className="text-3xl font-bold text-white">{score}%</p>
            <p className="text-sm text-white/80">
              {score >= 80 ? 'Excellent' : 
               score >= 60 ? 'Good' : 
               'Needs Improvement'}
            </p>
          </div>

          <div className="pt-4 border-t border-white/10 space-y-4">
            <p className="text-sm text-white/90">
              {explanation.description}
            </p>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-white/90">
                <Clock className="h-4 w-4 text-blue-500" />
                <span>{benefits.time}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-white/90">
                <DollarSign className="h-4 w-4 text-green-500" />
                <span>{benefits.cost}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-white/90">
                <TrendingUp className="h-4 w-4 text-gold" />
                <span>{benefits.growth}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
