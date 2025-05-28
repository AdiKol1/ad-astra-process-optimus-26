import React, { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { useAssessmentStore } from '@/contexts/assessment/store';
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
import { Helmet } from 'react-helmet-async';

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
  const assessmentStore = useAssessmentStore();
  const { recordMetric } = usePerformanceMonitor();

  const pageTitle = useMemo(() => {
    const company = assessmentStore.responses?.company;
    return company 
      ? `Process Optimization Report for ${company}`
      : 'Process Optimization Report';
  }, [assessmentStore.responses?.company]);

  const metaDescription = useMemo(() => {
    const score = assessmentStore.results?.score || 75;
    return `Assessment Score: ${score}% | Discover your process optimization opportunities and potential savings.`;
  }, [assessmentStore.results?.score]);

  // Track page view - run only once
  useEffect(() => {
    recordMetric('report_page_loaded');
    
    telemetry.track('assessment_report_viewed', {
      timestamp: new Date().toISOString(),
      hasUserInfo: !!(assessmentStore.responses?.name || assessmentStore.responses?.email),
      score: assessmentStore.results?.score,
      industry: assessmentStore.responses?.responses?.industry
    });

    logger.info('AssessmentReport mounted', { 
      hasData: !!assessmentStore.responses,
      isComplete: assessmentStore.isComplete,
      hasResults: !!assessmentStore.results
    });

    return () => {
      recordMetric('report_page_exited');
    };
  }, []); // Empty dependency array - run only once

  // Check if we have enough data to show the report
  const hasValidData = useMemo(() => {
    // Check if we have any responses at all
    const hasResponses = assessmentStore.responses && Object.keys(assessmentStore.responses).length > 0;
    
    // Debug logging
    console.log('AssessmentReport - Checking valid data:', {
      responses: assessmentStore.responses,
      responseKeys: assessmentStore.responses ? Object.keys(assessmentStore.responses) : [],
      hasResponses,
      isComplete: assessmentStore.isComplete,
      results: assessmentStore.results
    });
    
    // Check if we have some basic data
    return hasResponses || assessmentStore.isComplete;
  }, [assessmentStore.responses, assessmentStore.isComplete]);

  // Generate basic results if missing
  useEffect(() => {
    if (hasValidData && !assessmentStore.results) {
      const basicResults = {
        score: 75,
        recommendations: [
          'Consider implementing process automation',
          'Review current technology stack',
          'Optimize team workflows'
        ],
        insights: []
      };
      assessmentStore.setResults(basicResults);
    }
  }, [hasValidData, assessmentStore.results]); // Removed assessmentStore.setResults from deps

  // If no valid data, redirect to assessment
  useEffect(() => {
    if (!hasValidData) {
      logger.warn('No valid assessment data found, redirecting to assessment');
      toast({
        title: "Assessment Required",
        description: "Please complete the assessment first.",
        variant: "destructive",
      });
      navigate('/assessment');
    }
  }, [hasValidData, navigate, toast]);

  // Show loading if we don't have valid data
  if (!hasValidData) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Create report data from assessment store
  const reportData = {
    assessmentScore: {
      overall: assessmentStore.results?.score || 75,
      automationPotential: 65,
      sections: {}
    },
    results: {
      annual: {
        savings: 50000,
        hours: 1000
      },
      cac: undefined
    },
    recommendations: assessmentStore.results?.recommendations || [
      'Implement process automation',
      'Optimize current workflows',
      'Enhance team collaboration'
    ],
    industryAnalysis: undefined,
    userInfo: {
      name: assessmentStore.responses?.name,
      email: assessmentStore.responses?.email,
      company: assessmentStore.responses?.company
    }
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
        <ReportHeader userInfo={reportData.userInfo} />
        
        <motion.div 
          className="space-y-6 mt-8"
          variants={ANIMATION_VARIANTS}
        >
          <UrgencyBanner 
            score={assessmentStore.results?.score || 75} 
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