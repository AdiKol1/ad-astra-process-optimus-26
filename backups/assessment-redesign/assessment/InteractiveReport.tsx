import React, { useEffect, useMemo } from 'react';
import { ResultsVisualization } from './visualization/ResultsVisualization';
import { IndustryInsights } from './IndustryInsights';
import { UrgencyBanner } from './UrgencyBanner';
import { ReportHeader } from './report/ReportHeader';
import { CallToAction } from './report/CallToAction';
import { useAssessmentStore } from '@/contexts/assessment/store';
import { ErrorBoundary } from '@/components/error/ErrorBoundary';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { telemetry } from '@/utils/monitoring/telemetry';
import { logger } from '@/utils/logger';
import type { ResultsVisualizationProps } from '@/types/assessment';
import { motion } from 'framer-motion';

interface InteractiveReportProps {
  data: {
    assessmentScore?: {
      overall: number;
      automationPotential: number;
      sections: Record<string, any>;
    };
    results?: {
      annual: {
        savings: number;
        hours: number;
      };
      cac?: any;
    };
    recommendations?: string[];
    industryAnalysis?: any;
    userInfo?: {
      name?: string;
      email?: string;
      company?: string;
    };
  };
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
  const assessmentStore = useAssessmentStore();

  useEffect(() => {
    if (data?.assessmentScore) {
      try {
        telemetry.track('interactive_report_viewed', {
          totalScore: data.assessmentScore.overall,
          timestamp: new Date().toISOString(),
          hasProcessScore: !!data.assessmentScore.sections,
          hasTechnologyScore: !!data.assessmentScore.sections,
          hasTeamScore: !!data.assessmentScore.sections
        });
      } catch (err) {
        const error = err as Error;
        logger.error('Error tracking report view:', { message: error.message, stack: error.stack });
      }
    }
  }, [data?.assessmentScore]);

  const scores = useMemo<ResultsVisualizationProps['scores'] | null>(() => {
    if (!data?.assessmentScore) return null;
    
    return {
      process: data.assessmentScore.overall || 75,
      technology: data.assessmentScore.automationPotential || 65,
      team: data.assessmentScore.overall || 75
    };
  }, [data?.assessmentScore]);

  if (!data) {
    logger.warn('No data provided to InteractiveReport');
    return (
      <div 
        className="text-gray-600 p-4" 
        role="status"
        aria-live="polite"
      >
        No assessment data available. Please complete the assessment to view your report.
      </div>
    );
  }

  if (!scores) {
    logger.warn('No scores available for interactive report');
    return (
      <div 
        className="text-gray-600 p-4" 
        role="status"
        aria-live="polite"
      >
        Assessment scores are being calculated. Please wait...
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
          <ReportHeader userInfo={data.userInfo} />
        </ReportSection>
        
        <ReportSection index={1}>
          <ResultsVisualization scores={scores} />
        </ReportSection>
        
        <ReportSection index={2}>
          <IndustryInsights />
        </ReportSection>
        
        <ReportSection index={3}>
          <UrgencyBanner score={data.assessmentScore?.overall || 75} />
        </ReportSection>
        
        <ReportSection index={4}>
          <CallToAction />
        </ReportSection>
      </motion.div>
    </ErrorBoundary>
  );
};

InteractiveReport.displayName = 'InteractiveReport';