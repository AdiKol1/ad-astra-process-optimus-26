import React, { useCallback, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useAssessmentStore } from "@/stores/assessment";
import { BenefitsSection } from "./sections/BenefitsSection";
import { TeamAssessment } from "./sections/TeamAssessment";
import { PreviewInsights } from "./PreviewInsights";
import { ErrorBoundary } from '@/components/error/ErrorBoundary';
import { telemetry } from '@/utils/monitoring/telemetry';
import { logger } from '@/utils/logger';
import { motion, useReducedMotion } from 'framer-motion';
import type { AssessmentStep } from '@/types/assessment/state';
import { Helmet } from 'react-helmet';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor';

interface AssessmentStore {
  setStep: (step: AssessmentStep) => void;
  setError: (error: Error | null) => void;
  resetAssessment: () => void;
  isInitialized: boolean;
}

interface EngagementMetrics {
  timeSpent: number;
  scrollDepth: number;
  interactionCount: number;
}

const ANIMATION_DURATION = 0.3;
const STAGGER_DELAY = 0.1;

const CONTAINER_VARIANTS = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: STAGGER_DELAY,
      delayChildren: STAGGER_DELAY
    }
  }
};

const ITEM_VARIANTS = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30
    }
  }
};

// Schema markup for rich snippets
const PAGE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Process Optimization Assessment",
  "description": "Discover opportunities to streamline your operations and boost efficiency with our comprehensive process assessment tool.",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  }
};

export const AssessmentLanding: React.FC = React.memo(() => {
  const store = useAssessmentStore();
  const { setStep, setError, resetAssessment, isInitialized } = store as unknown as AssessmentStore;
  const prefersReducedMotion = useReducedMotion();
  const { recordMetric } = usePerformanceMonitor();

  // Track user engagement
  const [metrics, setMetrics] = React.useState<EngagementMetrics>({
    timeSpent: 0,
    scrollDepth: 0,
    interactionCount: 0
  });

  useEffect(() => {
    const startTime = Date.now();
    let scrollDepth = 0;
    let interactions = 0;

    const handleScroll = () => {
      const newDepth = Math.floor((window.scrollY + window.innerHeight) / document.documentElement.scrollHeight * 100);
      if (newDepth > scrollDepth) {
        scrollDepth = newDepth;
        setMetrics(prev => ({ ...prev, scrollDepth }));
      }
    };

    const handleInteraction = () => {
      interactions++;
      setMetrics(prev => ({ ...prev, interactionCount: interactions }));
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('click', handleInteraction);
    window.addEventListener('keypress', handleInteraction);

    const interval = setInterval(() => {
      setMetrics(prev => ({ 
        ...prev, 
        timeSpent: Math.floor((Date.now() - startTime) / 1000) 
      }));
    }, 1000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('keypress', handleInteraction);
      clearInterval(interval);
    };
  }, []);

  const handleStart = useCallback(() => {
    try {
      // Record performance metric
      recordMetric('assessment_start_clicked');

      // Reset any previous assessment data
      resetAssessment();
      
      // Set initial step
      setStep('process' as AssessmentStep);
      
      // Track assessment start with enhanced metrics
      telemetry.track('assessment_started', {
        timestamp: new Date().toISOString(),
        engagement: {
          timeSpentSeconds: metrics.timeSpent,
          maxScrollDepth: metrics.scrollDepth,
          interactions: metrics.interactionCount
        },
        userAgent: navigator.userAgent,
        screenSize: {
          width: window.innerWidth,
          height: window.innerHeight
        },
        referrer: document.referrer
      });

      logger.info('User started assessment', {
        metrics,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      const err = error as Error;
      setError(err);
      logger.error('Error starting assessment:', {
        message: err.message,
        stack: err.stack,
        metrics
      });
    }
  }, [setStep, setError, resetAssessment, metrics, recordMetric]);

  if (!isInitialized) {
    return (
      <div 
        className="flex justify-center items-center min-h-[400px]"
        role="status"
        aria-label="Loading assessment"
      >
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <Helmet>
        <title>Process Optimization Assessment | Streamline Your Operations</title>
        <meta name="description" content="Discover opportunities to streamline your operations and boost efficiency with our comprehensive process assessment tool." />
        <meta name="keywords" content="process optimization, efficiency, assessment, automation, business improvement" />
        <script type="application/ld+json">
          {JSON.stringify(PAGE_SCHEMA)}
        </script>
      </Helmet>

      {/* Skip to main content link for accessibility */}
      <a 
        href="#assessment-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 focus:p-4 focus:bg-white focus:text-blue-600"
      >
        Skip to main content
      </a>

      <motion.div
        className="max-w-7xl mx-auto px-4 py-12"
        variants={prefersReducedMotion ? {} : CONTAINER_VARIANTS}
        initial="hidden"
        animate="visible"
        role="main"
        aria-labelledby="assessment-title"
        id="assessment-content"
      >
        <motion.div 
          className="text-center mb-12"
          variants={prefersReducedMotion ? {} : ITEM_VARIANTS}
        >
          <motion.h1 
            id="assessment-title"
            className="text-4xl font-bold text-gray-900 mb-4"
            variants={prefersReducedMotion ? {} : ITEM_VARIANTS}
          >
            Process Optimization Assessment
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-600"
            variants={prefersReducedMotion ? {} : ITEM_VARIANTS}
          >
            Discover opportunities to streamline your operations and boost efficiency
          </motion.p>
        </motion.div>

        <motion.div 
          variants={prefersReducedMotion ? {} : ITEM_VARIANTS}
          role="region"
          aria-label="Assessment preview"
        >
          <PreviewInsights />
        </motion.div>

        <motion.div 
          variants={prefersReducedMotion ? {} : ITEM_VARIANTS}
          role="region"
          aria-label="Assessment benefits"
        >
      <BenefitsSection />
        </motion.div>

        <motion.div 
          variants={prefersReducedMotion ? {} : ITEM_VARIANTS}
          role="region"
          aria-label="Team assessment information"
        >
          <TeamAssessment />
        </motion.div>

        <motion.div 
          className="text-center mt-12"
          variants={prefersReducedMotion ? {} : ITEM_VARIANTS}
        >
        <Button
            onClick={handleStart}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg flex items-center gap-2 group transition-all duration-300"
            aria-label="Start the process optimization assessment"
          >
            Start Assessment 
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>

        <motion.div 
          className="text-center mt-4 text-sm text-gray-500"
          variants={prefersReducedMotion ? {} : ITEM_VARIANTS}
        >
          Takes approximately 5-10 minutes to complete
        </motion.div>
      </motion.div>
    </ErrorBoundary>
  );
});

AssessmentLanding.displayName = 'AssessmentLanding';