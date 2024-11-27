import { SectionScore } from '../../../../types/assessment';
import { CalculationProps } from './types';
import { calculateErrorScore } from './utils';

export const calculateProcessScore = ({ responses }: CalculationProps): SectionScore => {
  const manualProcesses = responses.manualProcesses || [];
  const processTime = Number(responses.processTime) || 0;
  const errorRate = responses.errorRate || '';
  const bottlenecks = responses.bottlenecks || [];

  const processCountScore = 1 - (manualProcesses.length / 8);
  const timeScore = Math.max(0, 1 - (processTime / 40));
  const errorScore = calculateErrorScore(errorRate);
  const bottleneckScore = 1 - (bottlenecks.length / 7);

  return {
    score: (processCountScore * 0.3 + timeScore * 0.3 + errorScore * 0.2 + bottleneckScore * 0.2),
    confidence: 0.85,
    areas: [
      {
        name: 'Manual Process Load',
        score: processCountScore,
        insights: [`${manualProcesses.length} manual processes identified`]
      },
      {
        name: 'Time Efficiency',
        score: timeScore,
        insights: [`${processTime} hours spent on manual tasks weekly`]
      },
      {
        name: 'Error Management',
        score: errorScore,
        insights: [`Current error rate: ${errorRate}`]
      }
    ]
  };
};