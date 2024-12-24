import React from 'react';
import { BaseScoreCard } from './BaseScoreCard';
import { formatCurrency } from '@/lib/utils';

interface SavingsCardProps {
  title: string;
  value: number;
}

export const SavingsCard: React.FC<SavingsCardProps> = ({ title, value }) => (
  <BaseScoreCard
    title={title}
    value={formatCurrency(value)}
    suffix=""
    tooltipContent="Calculated as: 60% reduction in labor costs, 80% reduction in error-related costs, and 40% reduction in operational costs"
  />
);