export interface ResultsVisualizationProps {
  scores: {
    process: number;
    technology: number;
    team: number;
    total: number;
  };
}

export interface MetricCardProps {
  title: string;
  value: number | string;
  description?: string;
  trend?: {
    direction: 'up' | 'down';
    value: number;
  };
  icon?: React.ReactNode;
}

export interface ScoreCardProps {
  category: string;
  score: number;
  description: string;
  recommendations: string[];
} 