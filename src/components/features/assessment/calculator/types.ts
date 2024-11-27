import type { SectionScore } from '../../../../types/assessment';

export interface CalculationProps {
  responses: Record<string, any>;
}

export interface ScoreWeights {
  [key: string]: {
    score: number;
    weight: number;
  };
}