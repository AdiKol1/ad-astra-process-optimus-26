import React from 'react';
import { BaseScoreCard } from './BaseScoreCard';

interface EfficiencyCardProps {
  title: string;
  value: number;
}

export const EfficiencyCard: React.FC<EfficiencyCardProps> = ({ title, value }) => (
  <BaseScoreCard
    title={title}
    value={value}
    tooltipContent={`
      Efficiency improvement calculated from:
      • Time reduction in manual processes
      • Error rate improvement
      • Process automation potential
    `}
  />
);