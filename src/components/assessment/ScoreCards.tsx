import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';

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

export const SectionScoreCard: React.FC<{ title: string; score: number }> = ({ title, score }) => (
  <Card>
    <CardContent className="p-6">
      <h3 className="text-sm font-medium text-muted-foreground mb-2">{title}</h3>
      <p className="text-3xl font-bold">{score}%</p>
    </CardContent>
  </Card>
);