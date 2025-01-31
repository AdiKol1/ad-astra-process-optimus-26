import React, { useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { useAssessment } from '@/contexts/assessment/AssessmentContext';
import { ReportHeader } from './report/ReportHeader';
import { InteractiveReport } from './InteractiveReport';
import { UrgencyBanner } from './UrgencyBanner';
import TrustIndicators from '@/components/shared/TrustIndicators';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { logger } from '@/utils/logger';
import { telemetry } from '@/utils/monitoring/telemetry';
import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor';
import { ErrorBoundary } from '@/components/error/ErrorBoundary';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { 
  AssessmentContextType, 
  AssessmentData,
  ReportHeaderProps,
  UrgencyBannerProps,
  InteractiveReportProps
} from './types';

const ANIMATION_VARIANTS = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut'
    }
  }
};

const AssessmentReport: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { assessmentData, state } = useAssessment() as AssessmentContextType;
  const [isLoading, setIsLoading] = React.useState(true);
  const [retryCount, setRetryCount] = React.useState(0);
  const { recordMetric } = usePerformanceMonitor();

  const pageTitle = useMemo(() => {
    const company = assessmentData?.userInfo?.companyName;
    return company 
      ? `Process Optimization Report for ${company}`
      : 'Process Optimization Report';
  }, [assessmentData?.userInfo?.companyName]);

  const metaDescription = useMemo(() => {
    const score = assessmentData?.qualificationScore;
    const potential = assessmentData?.automationPotential;
    return `Assessment Score: ${score}% | Automation Potential: ${potential}% | Discover your process optimization opportunities and potential savings.`;
  }, [assessmentData?.qualificationScore, assessmentData?.automationPotential]);

  useEffect(() => {
    recordMetric('report_page_loaded');
    
    telemetry.track('assessment_report_viewed', {
      timestamp: new Date().toISOString(),
      hasUserInfo: !!assessmentData?.userInfo,
      qualificationScore: assessmentData?.qualificationScore,
      automationPotential: assessmentData?.automationPotential,
      industry: assessmentData?.userInfo?.industry
    });

    logger.info('AssessmentReport mounted', { 
      hasData: !!assessmentData,
      state: state 
    });

    return () => {
      recordMetric('report_page_exited');
    };
  }, [assessmentData, state, recordMetric]);

  const checkAssessmentData = useCallback(() => {
    try {
      if (!state.responses || !state.completed) {
        logger.warn('Assessment incomplete or no responses found', { 
          hasResponses: !!state.responses,
          completed: state.completed,
          retryCount 
        });
        
        toast({
          title: "Assessment Incomplete",
          description: "Please complete all sections of the assessment first.",
          variant: "destructive",
        });
        
        telemetry.track('assessment_report_error', {
          error: 'incomplete_assessment',
          retryCount
        });

        navigate('/assessment');
        return false;
      }

      if (!state.results) {
        logger.warn('Missing assessment results', { 
          hasResults: !!state.results,
          retryCount
        });
        
        if (retryCount < 3) {
          setRetryCount(prev => prev + 1);
          toast({
            title: "Loading Results",
            description: "Please wait while we process your assessment...",
            variant: "default",
          });
          return false;
        }
        
        toast({
          title: "Results Not Available",
          description: "There was an error processing your assessment. Please try again.",
          variant: "destructive",
        });
        
        telemetry.track('assessment_report_error', {
          error: 'missing_results',
          retryCount
        });

        navigate('/assessment');
        return false;
      }

      return true;
    } catch (error) {
      const err = error as Error;
      logger.error('Error checking assessment data:', {
        message: err.message,
        stack: err.stack
      });
      return false;
    }
  }, [state.responses, state.completed, state.results, navigate, toast, retryCount]);

  useEffect(() => {
    const isValid = checkAssessmentData();
    setIsLoading(!isValid);
  }, [checkAssessmentData]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const reportData: InteractiveReportProps['data'] = {
    assessmentScore: {
      overall: assessmentData.qualificationScore || 0,
      automationPotential: assessmentData.automationPotential || 65,
      sections: assessmentData.sectionScores || {}
    },
    results: {
      annual: {
        savings: assessmentData.results?.annual?.savings || 0,
        hours: assessmentData.results?.annual?.hours || 0
      },
      cac: assessmentData.results?.cac
    },
    recommendations: assessmentData.recommendations || {},
    industryAnalysis: assessmentData.industryAnalysis,
    userInfo: assessmentData.userInfo
  };

  return (
    <ErrorBoundary>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>

      <motion.div 
        className="container mx-auto px-4 py-8 max-w-4xl"
        initial="hidden"
        animate="visible"
        variants={ANIMATION_VARIANTS}
      >
        <ReportHeader userInfo={assessmentData.userInfo} />
        
        <motion.div 
          className="space-y-6 mt-8"
          variants={ANIMATION_VARIANTS}
        >
          <UrgencyBanner 
            score={assessmentData?.score ?? assessmentData?.qualificationScore} 
          />
          
          <Card className="p-6 shadow-lg">
            <InteractiveReport data={reportData} />
          </Card>
        </motion.div>

        <motion.div 
          variants={ANIMATION_VARIANTS}
          className="mt-12"
        >
          <TrustIndicators />
        </motion.div>

        <motion.div 
          className="text-center mt-8 text-sm text-gray-500"
          variants={ANIMATION_VARIANTS}
        >
          Report generated on {new Date().toLocaleDateString()} • 
          Confidential and proprietary
        </motion.div>
      </motion.div>
    </ErrorBoundary>
  );
};

export default AssessmentReport;