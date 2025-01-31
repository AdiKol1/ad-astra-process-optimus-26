import React, { useCallback, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import type { AssessmentStep } from '@/types/assessment/state';
import { useAssessmentStore } from '@/stores/assessment';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { logger } from '@/utils/logger';
import { telemetry } from '@/utils/monitoring/telemetry';
import { ErrorBoundary } from '@/components/error/ErrorBoundary';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor';

interface Insight {
  title: string;
  description: string;
  icon: string;
  id: string;
  metrics?: {
    averageImprovement: number;
    timeToValue: string;
  };
}

interface InsightCardProps {
  insight: Insight;
  index: number;
  onInteraction: (insightId: string) => void;
}

interface AssessmentStore {
  setStep: (step: AssessmentStep) => void;
  setError: (error: Error | null) => void;
  isLoading: boolean;
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

const InsightCard: React.FC<InsightCardProps> = React.memo(({ insight, index, onInteraction }) => {
  const prefersReducedMotion = useReducedMotion();
  
  const handleInteraction = useCallback(() => {
    onInteraction(insight.id);
  }, [insight.id, onInteraction]);

  return (
    <motion.div
      initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
      animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
      exit={prefersReducedMotion ? {} : { opacity: 0, y: -20 }}
      transition={{ 
        duration: ANIMATION_DURATION,
        delay: index * STAGGER_DELAY 
      }}
      className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-all duration-300 bg-white"
      role="article"
      aria-labelledby={`insight-title-${insight.id}`}
      onClick={handleInteraction}
      onKeyPress={(e) => e.key === 'Enter' && handleInteraction()}
      tabIndex={0}
    >
      <div 
        className="text-4xl mb-4" 
        role="img" 
        aria-label={insight.title}
      >
        {insight.icon}
      </div>
      <h3 
        id={`insight-title-${insight.id}`}
        className="text-xl font-semibold text-gray-900 mb-3"
      >
        {insight.title}
      </h3>
      <p className="text-gray-600 mb-4">{insight.description}</p>
      
      {insight.metrics && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Average Improvement</p>
              <p className="text-lg font-semibold text-green-600">
                {insight.metrics.averageImprovement}%
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Time to Value</p>
              <p className="text-lg font-semibold text-blue-600">
                {insight.metrics.timeToValue}
              </p>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
});

InsightCard.displayName = 'InsightCard';

export const PreviewInsights: React.FC = React.memo(() => {
  const { setStep, isLoading, setError } = useAssessmentStore() as AssessmentStore;
  const prefersReducedMotion = useReducedMotion();
  const { recordMetric } = usePerformanceMonitor();

  const previewInsights: Insight[] = useMemo(() => [
    {
      id: 'process-efficiency',
      title: 'Process Efficiency',
      description: 'Learn how your current processes compare to industry standards and identify optimization opportunities.',
      icon: '⚡',
      metrics: {
        averageImprovement: 35,
        timeToValue: '2-4 weeks'
      }
    },
    {
      id: 'cost-savings',
      title: 'Cost Savings',
      description: 'Discover potential cost savings through strategic process optimization and automation.',
      icon: '💰',
      metrics: {
        averageImprovement: 25,
        timeToValue: '1-3 months'
      }
    },
    {
      id: 'team-productivity',
      title: 'Team Productivity',
      description: 'Understand how to boost your team\'s productivity through streamlined workflows and better tools.',
      icon: '👥',
      metrics: {
        averageImprovement: 40,
        timeToValue: '2-6 weeks'
      }
    }
  ], []);

  useEffect(() => {
    try {
      telemetry.track('preview_insights_viewed', {
        timestamp: new Date().toISOString(),
        insightCount: previewInsights.length
      });
    } catch (error) {
      const err = error as Error;
      logger.error('Error tracking preview insights view:', {
        message: err.message,
        stack: err.stack
      });
    }
  }, [previewInsights.length]);

  const handleInsightInteraction = useCallback((insightId: string) => {
    try {
      recordMetric('insight_card_interaction');
      
      telemetry.track('preview_insight_interaction', {
        insightId,
        timestamp: new Date().toISOString()
      });

      logger.info('User interacted with preview insight', {
        insightId,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      const err = error as Error;
      logger.error('Error tracking insight interaction:', {
        message: err.message,
        stack: err.stack,
        insightId
      });
    }
  }, [recordMetric]);

  const handleContinue = useCallback(() => {
    try {
      recordMetric('preview_insights_continued');
      
      setStep('process' as AssessmentStep);
      
      telemetry.track('preview_insights_continued', {
        timestamp: new Date().toISOString()
      });

      logger.info('User continued from preview insights');
    } catch (error) {
      const err = error as Error;
      setError(err);
      logger.error('Error continuing from preview insights:', {
        message: err.message,
        stack: err.stack
      });
    }
  }, [setStep, setError, recordMetric]);

  if (isLoading) {
    return (
      <div 
        className="flex justify-center items-center min-h-[400px]"
        role="status"
        aria-label="Loading preview insights"
      >
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <motion.div 
        className="bg-gray-50 rounded-xl p-8"
        variants={prefersReducedMotion ? {} : CONTAINER_VARIANTS}
        initial="hidden"
        animate="visible"
        role="region"
        aria-labelledby="preview-insights-title"
      >
        <motion.h2 
          id="preview-insights-title"
          className="text-2xl font-bold text-gray-900 mb-8 text-center"
          variants={prefersReducedMotion ? {} : ITEM_VARIANTS}
        >
          What You'll Discover
        </motion.h2>
        
        <div 
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8"
          role="list"
          aria-label="Preview insights"
        >
          <AnimatePresence mode="wait">
            {previewInsights.map((insight, index) => (
              <InsightCard 
                key={insight.id}
                insight={insight}
                index={index}
                onInteraction={handleInsightInteraction}
              />
            ))}
          </AnimatePresence>
        </div>

        <motion.div 
          className="text-center"
          variants={prefersReducedMotion ? {} : ITEM_VARIANTS}
        >
          <Button
            onClick={handleContinue}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg transition-colors duration-300"
            aria-label="Continue to process assessment"
          >
            Start Your Assessment
          </Button>
          <p className="mt-4 text-sm text-gray-500">
            Takes approximately 5-10 minutes to complete
          </p>
        </motion.div>
      </motion.div>
    </ErrorBoundary>
  );
});

PreviewInsights.displayName = 'PreviewInsights';