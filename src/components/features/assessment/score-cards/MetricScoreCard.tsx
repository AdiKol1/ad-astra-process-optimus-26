import React from 'react';
import { BaseScoreCard } from './BaseScoreCard';

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
  <BaseScoreCard
    title={title}
    value={value}
    tooltipContent={tooltipContent || description}
  />
);