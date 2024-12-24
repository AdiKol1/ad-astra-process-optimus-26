import React from 'react';
import { BaseScoreCard } from './BaseScoreCard';

interface MetricScoreCardProps {
  title: string;
  value: number;
  suffix?: string;
  tooltipContent?: string;
}

export const MetricScoreCard: React.FC<MetricScoreCardProps> = ({ 
  title, 
  value, 
  suffix,
  tooltipContent 
}) => (
  <BaseScoreCard
    title={title}
    value={value}
    suffix={suffix}
    tooltipContent={tooltipContent}
  />
);