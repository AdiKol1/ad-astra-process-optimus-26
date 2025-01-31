import React, { useEffect, useMemo } from 'react';
import { ResultsVisualization } from './visualization/ResultsVisualization';
import { IndustryInsights } from './IndustryInsights';
import { UrgencyBanner } from './UrgencyBanner';
import { ReportHeader } from './report/ReportHeader';
import { CallToAction } from './report/CallToAction';
import { useAssessmentStore } from '@/stores/assessment';
import { ErrorBoundary } from '@/components/error/ErrorBoundary';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { telemetry } from '@/utils/monitoring/telemetry';
import { logger } from '@/utils/logger';
import type { ResultsVisualizationProps } from '@/types/assessment';
import { motion } from 'framer-motion';
import { InteractiveReportProps } from './types';

interface AssessmentResults {
  scores: {
    totalScore: number;
    processScore: number;
    technologyScore: number;
    teamScore: number;
    [key: string]: number;
  };
}

interface AssessmentStore {
  results: AssessmentResults | null;
  isLoading: boolean;
  error: Error | null;
}

const ANIMATION_DURATION = 0.5;
const STAGGER_DELAY = 0.1;

const ReportSection: React.FC<{ children: React.ReactNode; index: number }> = React.memo(({ children, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: ANIMATION_DURATION, delay: index * STAGGER_DELAY }}
  >
    {children}
  </motion.div>
));

ReportSection.displayName = 'ReportSection';

export const InteractiveReport: React.FC<InteractiveReportProps> = ({ data }) => {
  const { results, isLoading, error } = useAssessmentStore() as AssessmentStore;

  useEffect(() => {
    if (results) {
      try {
        telemetry.track('interactive_report_viewed', {
          totalScore: results.scores.totalScore,
          timestamp: new Date().toISOString(),
          hasProcessScore: !!results.scores.processScore,
          hasTechnologyScore: !!results.scores.technologyScore,
          hasTeamScore: !!results.scores.teamScore
        });
      } catch (err) {
        const error = err as Error;
        logger.error('Error tracking report view:', { message: error.message, stack: error.stack });
      }
    }
  }, [results]);

  const scores = useMemo<ResultsVisualizationProps['scores'] | null>(() => {
    if (!results?.scores) return null;
    
    return {
      process: results.scores.processScore,
      technology: results.scores.technologyScore,
      team: results.scores.teamScore
    };
  }, [results?.scores]);

  if (error) {
    logger.error('Error in InteractiveReport:', error);
    return (
      <div 
        className="text-red-600 p-4 rounded-lg bg-red-50" 
        role="alert"
        aria-live="assertive"
      >
        Error loading report: {error.message}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div 
        className="flex justify-center items-center min-h-[400px]"
        aria-label="Loading assessment report"
      >
        <LoadingSpinner />
      </div>
    );
  }

  if (!results || !scores) {
    logger.warn('No results available for interactive report');
    return (
      <div 
        className="text-gray-600 p-4" 
        role="status"
        aria-live="polite"
      >
        No assessment results available. Please complete the assessment to view your report.
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <motion.div 
        className="space-y-8" 
        role="main" 
        aria-label="Assessment Results Report"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: ANIMATION_DURATION }}
      >
        <ReportSection index={0}>
          <ReportHeader />
        </ReportSection>
        
        <ReportSection index={1}>
          <ResultsVisualization scores={scores} />
        </ReportSection>
        
        <ReportSection index={2}>
          <IndustryInsights />
        </ReportSection>
        
        <ReportSection index={3}>
          <UrgencyBanner />
        </ReportSection>
        
        <ReportSection index={4}>
          <CallToAction />
        </ReportSection>
      </motion.div>
    </ErrorBoundary>
  );
};

InteractiveReport.displayName = 'InteractiveReport';