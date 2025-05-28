import React, { useMemo, useCallback, useEffect } from 'react';
import { useAssessmentStore } from '@/stores/assessment';
import { calculateAutomationScore, calculateEfficiencyScore, getIndustryBenchmarks } from '@/utils/assessment';
import { ErrorBoundary } from '@/components/error/ErrorBoundary';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { telemetry } from '@/utils/monitoring/telemetry';
import { logger } from '@/utils/logger';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';

interface MetricItem {
  metric: string;
  industry: string;
  benchmark: string;
  difference: number;
  trend?: 'up' | 'down' | 'stable';
  description: string;
}

interface InsightData {
  metrics: MetricItem[];
  timestamp: string;
  industry: string;
  recommendations: string[];
}

interface AssessmentResponses {
  industry?: string;
  processComplexity?: string;
  manualProcesses?: string[];
  teamSize?: number;
  toolStack?: string[];
}

interface AssessmentStore {
  responses: AssessmentResponses | null;
  isLoading: boolean;
  error: Error | null;
  setError: (error: Error | null) => void;
}

const ANIMATION_DURATION = 0.3;
const STAGGER_DELAY = 0.1;
const DEFAULT_INDUSTRY = 'Technology';
const DEFAULT_COMPLEXITY = 'Medium';

const getMetricDescription = (metric: string, difference: number): string => {
  if (metric === 'Process Automation') {
    return difference >= 0
      ? 'Your automation level is above industry standards, indicating good process optimization.'
      : 'There\'s room to improve automation in your processes to match industry standards.';
  }
  return difference >= 0
    ? 'Your efficiency score exceeds the industry benchmark, showing strong operational performance.'
    : 'Consider optimizing your processes to improve efficiency to industry standards.';
};

const calculateInsights = (responses: AssessmentResponses | null): InsightData | null => {
  if (!responses) {
    logger.warn('No responses available for industry insights');
    return null;
  }

  try {
    const {
      industry = DEFAULT_INDUSTRY,
      processComplexity = DEFAULT_COMPLEXITY,
      manualProcesses = [],
      teamSize = 0,
      toolStack = []
    } = responses;

    const automationScore = calculateAutomationScore(manualProcesses);
    const efficiencyScore = calculateEfficiencyScore(processComplexity);
    const { automationBenchmark, efficiencyBenchmark } = getIndustryBenchmarks(industry);

    // Track insights calculation
    telemetry.track('industry_insights_calculated', {
      industry,
      automationScore,
      efficiencyScore,
      teamSize,
      toolCount: toolStack.length,
      timestamp: new Date().toISOString()
    });
    
    // Ensure all values are numbers before calculations
    const automationDiff = typeof automationScore === 'number' && typeof automationBenchmark === 'number' 
      ? automationScore - automationBenchmark 
      : 0;
    
    const efficiencyDiff = typeof efficiencyScore === 'number' && typeof efficiencyBenchmark === 'number'
      ? efficiencyScore - efficiencyBenchmark
      : 0;

    // Generate recommendations based on scores
    const recommendations = [];
    if (automationDiff < 0) {
      recommendations.push('Consider implementing automation tools for manual processes');
    }
    if (efficiencyDiff < 0) {
      recommendations.push('Review and optimize current processes for better efficiency');
    }
    if (toolStack.length < 3) {
      recommendations.push('Evaluate additional tools to support your processes');
    }

    return {
      metrics: [
        {
          metric: 'Process Automation',
          industry: typeof automationScore === 'number' ? `${automationScore}%` : '0%',
          benchmark: typeof automationBenchmark === 'number' ? `${automationBenchmark}%` : '0%',
          difference: automationDiff,
          trend: automationDiff > 5 ? 'up' : automationDiff < -5 ? 'down' : 'stable',
          description: getMetricDescription('Process Automation', automationDiff)
        },
        {
          metric: 'Efficiency Score',
          industry: typeof efficiencyScore === 'number' ? `${Number(efficiencyScore).toFixed(1)}` : '0.0',
          benchmark: typeof efficiencyBenchmark === 'number' ? `${Number(efficiencyBenchmark).toFixed(1)}` : '0.0',
          difference: efficiencyDiff,
          trend: efficiencyDiff > 0.5 ? 'up' : efficiencyDiff < -0.5 ? 'down' : 'stable',
          description: getMetricDescription('Efficiency Score', efficiencyDiff)
        }
      ],
      timestamp: new Date().toISOString(),
      industry,
      recommendations
    };
  } catch (error) {
    const err = error as Error;
    logger.error('Error calculating industry insights:', { 
      message: err.message, 
      stack: err.stack,
      responses 
    });
    telemetry.track('industry_insights_error', { 
      message: err.message,
      timestamp: new Date().toISOString()
    });
    return null;
  }
};

const MetricCard: React.FC<{ item: MetricItem; index: number }> = React.memo(({ item, index }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{
      duration: ANIMATION_DURATION,
      delay: index * STAGGER_DELAY
    }}
    className="flex flex-col p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
    role="article"
    aria-labelledby={`metric-${item.metric}`}
  >
    <div className="flex justify-between items-start mb-2">
      <div>
        <h4 
          id={`metric-${item.metric}`}
          className="text-sm font-medium text-gray-900"
        >
          {item.metric}
        </h4>
        <p className="text-xs text-gray-500">
          Industry benchmark: 
          <span className="ml-1 font-medium">{item.benchmark}</span>
        </p>
      </div>
      <div className="text-right">
        <p 
          className={`text-lg font-semibold ${
            item.difference >= 0 ? 'text-green-600' : 'text-red-600'
          }`}
          aria-label={`Your score: ${item.industry}`}
        >
          {item.industry}
          {item.trend && (
            <span 
              className="ml-1" 
              aria-label={`Trend: ${item.trend}`}
            >
              {item.trend === 'up' ? '↑' : item.trend === 'down' ? '↓' : '→'}
            </span>
          )}
        </p>
        <p 
          className="text-xs text-gray-500"
          aria-label={`${Math.abs(item.difference).toFixed(1)}% ${
            item.difference >= 0 ? 'above' : 'below'
          } benchmark`}
        >
          {Math.abs(item.difference).toFixed(1)}% {item.difference >= 0 ? 'above' : 'below'}
        </p>
      </div>
    </div>
    <p className="text-sm text-gray-600 mt-2">
      {item.description}
    </p>
  </motion.div>
));

MetricCard.displayName = 'MetricCard';

const InsightsContent: React.FC<{ data: InsightData }> = React.memo(({ data }) => (
  <Card className="bg-white p-6 my-4">
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: ANIMATION_DURATION }}
      role="region"
      aria-label={`Industry Insights for ${data.industry}`}
    >
      <motion.h3 
        className="text-xl font-semibold text-gray-900 mb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: ANIMATION_DURATION }}
      >
        Industry Insights
        <span className="text-sm font-normal text-gray-500 ml-2">
          {data.industry} Industry
        </span>
      </motion.h3>

      <div className="space-y-4">
        <AnimatePresence mode="wait">
          {data.metrics.map((item, index) => (
            <MetricCard 
              key={item.metric} 
              item={item}
              index={index}
            />
          ))}
        </AnimatePresence>
      </div>

      {data.recommendations.length > 0 && (
        <motion.div
          className="mt-6 p-4 bg-blue-50 rounded-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: ANIMATION_DURATION,
            delay: data.metrics.length * STAGGER_DELAY
          }}
        >
          <h4 className="text-sm font-medium text-blue-900 mb-2">
            Recommendations
          </h4>
          <ul className="list-disc list-inside space-y-1">
            {data.recommendations.map((recommendation, index) => (
              <motion.li
                key={index}
                className="text-sm text-blue-800"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ 
                  duration: ANIMATION_DURATION,
                  delay: (data.metrics.length * STAGGER_DELAY) + (index * STAGGER_DELAY)
                }}
              >
                {recommendation}
              </motion.li>
            ))}
          </ul>
        </motion.div>
      )}
    </motion.div>
  </Card>
));

InsightsContent.displayName = 'InsightsContent';

export const IndustryInsights: React.FC = React.memo(() => {
  const { responses, isLoading, error, setError } = useAssessmentStore() as AssessmentStore;

  const insightData = useMemo(() => calculateInsights(responses), [responses]);

  useEffect(() => {
    if (responses && !insightData) {
      setError(new Error('Failed to calculate insights. Please try again.'));
    }
  }, [responses, insightData, setError]);

  const handleRetry = useCallback(() => {
    setError(null);
    telemetry.track('industry_insights_retry', {
      timestamp: new Date().toISOString()
    });
  }, [setError]);

  if (error) {
    return (
      <motion.div 
        className="text-red-600 p-4 rounded-lg bg-red-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        role="alert"
      >
        <p className="font-medium">Error loading insights: {error.message}</p>
        <button
          onClick={handleRetry}
          className="mt-2 text-sm text-red-700 hover:text-red-800"
        >
          Try again
        </button>
      </motion.div>
    );
  }

  if (isLoading) {
    return (
      <div 
        className="flex justify-center items-center min-h-[200px]"
        role="status"
        aria-label="Loading insights"
      >
        <LoadingSpinner />
      </div>
    );
  }

  if (!insightData) {
    return (
      <motion.div 
        className="text-gray-600 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        role="status"
      >
        No insights available yet. Complete the assessment to view industry comparisons.
      </motion.div>
    );
  }

  return (
    <ErrorBoundary>
      <InsightsContent data={insightData} />
    </ErrorBoundary>
  );
});

IndustryInsights.displayName = 'IndustryInsights';