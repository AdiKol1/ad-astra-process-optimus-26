import { AssessmentData, MarketingMetrics } from '@/types/assessment';

export interface MigrationMetadata {
  version: string;
  timestamp: string;
  description: string;
  applied: boolean;
}

export interface MigrationResult {
  success: boolean;
  error?: string;
  details?: {
    recordsProcessed: number;
    recordsSkipped: number;
    warnings: string[];
  };
}

export interface DataVersion {
  v1_0: {
    assessment: Omit<AssessmentData, 'automationPotential' | 'sectionScores'>;
  };
  v1_1: {
    assessment: AssessmentData;
    process: ProcessMetrics;
    marketing: MarketingMetrics;
  };
  v2_0: {
    assessment: AssessmentData & {
      aiSuggestions?: string[];
      industryBenchmarks?: {
        efficiency: number;
        costs: number;
        automation: number;
      };
    };
  };
}

export interface ProcessMetrics {
  metric1: number;
  metric2: number;
  // Add additional fields as required
}

export type MigrationFunction = (data: any) => Promise<MigrationResult>;
