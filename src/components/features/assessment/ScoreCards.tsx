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
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-white">{title}</h3>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Info className="h-4 w-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">Score calculated based on assessment responses and industry benchmarks</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <p className="text-3xl font-bold text-white">
        {value}
        {suffix}
      </p>
    </CardContent>
  </Card>
);

export const SavingsCard: React.FC<BaseCardProps> = ({ title, value }) => (
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
              <div className="space-y-2 max-w-xs">
                <p>Calculated as:</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>60% reduction in labor costs (employees × hours × $35/hr)</li>
                  <li>80% reduction in error-related costs</li>
                  <li>40% reduction in operational costs</li>
                </ul>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <p className="text-3xl font-bold text-white">
        {formatCurrency(value)}
      </p>
    </CardContent>
  </Card>
);

export const EfficiencyCard: React.FC<BaseCardProps> = ({ title, value }) => (
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
              <div className="space-y-2 max-w-xs">
                <p>Efficiency improvement calculated from:</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Time reduction in manual processes</li>
                  <li>Error rate improvement</li>
                  <li>Process automation potential</li>
                </ul>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <p className="text-3xl font-bold text-white">
        {value}%
      </p>
    </CardContent>
  </Card>
);

export const SectionScoreCard: React.FC<{ title: string; score: number }> = ({ title, score }) => {
  const Icon = getIcon(title);
  const benefits = getBenefits(title);
  const explanation = getSectionExplanation(title);
  const content = getTooltipContent(title, score);

  const getCalculationExplanation = (sectionTitle: string) => {
    const weightMap: Record<string, string> = {
      "Process Details": "20% of total score - Based on employee count and process volume",
      "Technology": "20% of total score - Based on current systems and integration needs",
      "Processes": "25% of total score - Based on manual processes and time spent",
      "Team": "15% of total score - Based on team size and department coverage",
      "Challenges": "20% of total score - Based on identified pain points and priorities"
    };
    return weightMap[sectionTitle] || "Score based on assessment responses";
  };

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
              <p className="text-sm text-white/90">{explanation.title}</p>
            </div>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <div className="space-y-2 max-w-xs">
                  <p className="font-medium">{getCalculationExplanation(title)}</p>
                  <p>{content.description}</p>
                  <p className="text-sm opacity-90">Impact: {content.impact}</p>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <div className="space-y-4">
          <div>
            <p className="text-3xl font-bold text-white">{score}%</p>
            <p className="text-base text-white/90">
              {score >= 80 ? 'Excellent' : 
               score >= 60 ? 'Good' : 
               'Needs Improvement'}
            </p>
          </div>

          <div className="pt-4 border-t border-white/10 space-y-4">
            <div className="space-y-2">
              <p className="text-base text-white/90 leading-relaxed">
                {explanation.description}
              </p>
            </div>

            <div className="space-y-3 bg-space-light p-4 rounded-lg">
              <h4 className="text-white font-medium">Key Benefits:</h4>
              <div className="flex items-center gap-2 text-sm text-white">
                <Clock className="h-4 w-4 text-blue-400" />
                <span>{benefits.time}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-white">
                <DollarSign className="h-4 w-4 text-green-400" />
                <span>{benefits.cost}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-white">
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