import React, { useCallback, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { SpotsCounter } from '@/components/ui/spots-counter';
import { useAssessmentStore } from '@/stores/assessment';
import { ErrorBoundary } from '@/components/error/ErrorBoundary';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { telemetry } from '@/utils/monitoring/telemetry';
import { logger } from '@/utils/logger';
import { CALENDAR_URL } from '@/constants/urls';
import { motion, AnimatePresence } from 'framer-motion';
import { UrgencyBannerProps } from './types';

interface IndustryComparison {
  score: number;
  percentile: number;
}

interface AssessmentResults {
  scores: {
    totalScore: number;
    [key: string]: number;
  };
}

interface AssessmentStore {
  results: AssessmentResults | null;
  isLoading: boolean;
  error: Error | null;
}

const INITIAL_SPOTS = 7;
const MIN_SPOTS = 2;
const SPOTS_UPDATE_INTERVAL = 900000; // 15 minutes
const PERCENTILE_MIN = 65;
const PERCENTILE_MAX = 95;
const PERCENTILE_MULTIPLIER = 1.2;

const calculateIndustryComparison = (score: number): IndustryComparison => {
  const validScore = typeof score === 'number' && !isNaN(score) ? score : 0;
  const percentile = Math.min(
    Math.max(PERCENTILE_MIN, Math.round(validScore * PERCENTILE_MULTIPLIER)), 
    PERCENTILE_MAX
  );
  return { score: validScore, percentile };
};

const BannerContent: React.FC<{ 
  percentile: number; 
  remainingSpots: number;
  onBookSession: () => void;
}> = React.memo(({ percentile, remainingSpots, onBookSession }) => (
  <motion.div 
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="flex flex-col md:flex-row md:items-center justify-between gap-4"
  >
    <div className="flex items-center space-x-3">
      <AlertTriangle 
        className="h-5 w-5 text-gold animate-pulse" 
        aria-hidden="true" 
      />
      <p className="text-sm md:text-base font-medium">
        Your business shows higher automation potential than{' '}
        <span className="font-bold text-gold">{percentile}%</span> of your industry
      </p>
    </div>
    <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
      <SpotsCounter 
        totalSpots={50} 
        remainingSpots={remainingSpots}
        aria-label={`${remainingSpots} consultation spots remaining out of 50`}
      />
      <Button 
        className="bg-gold hover:bg-gold-light text-space whitespace-nowrap transform transition-transform hover:scale-105"
        onClick={onBookSession}
        aria-label="Book a free strategy session"
      >
        Claim Free Strategy Session
      </Button>
    </div>
  </motion.div>
));

BannerContent.displayName = 'BannerContent';

export const UrgencyBanner: React.FC<UrgencyBannerProps> = React.memo(({ score }) => {
  const { results, isLoading, error } = useAssessmentStore() as AssessmentStore;
  const [remainingSpots, setRemainingSpots] = React.useState(INITIAL_SPOTS);

  // Simulate spots decreasing over time
  useEffect(() => {
    const updateSpots = () => {
      setRemainingSpots(prev => Math.max(MIN_SPOTS, prev - 1));
    };

    const interval = setInterval(updateSpots, SPOTS_UPDATE_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  const handleBookSession = useCallback(() => {
    try {
      const eventData = {
        source: 'urgency_banner',
        totalScore: results?.scores?.totalScore || 0,
        timestamp: new Date().toISOString(),
        remainingSpots
      };

      telemetry.track('strategy_session_clicked', eventData);
      window.open(CALENDAR_URL, '_blank', 'noopener,noreferrer');
    } catch (err) {
      const error = err as Error;
      logger.error('Error handling book session:', { message: error.message, stack: error.stack });
    }
  }, [results?.scores?.totalScore, remainingSpots]);

  const comparison = useMemo(() => {
    if (!results?.scores?.totalScore) return null;
    return calculateIndustryComparison(results.scores.totalScore);
  }, [results?.scores?.totalScore]);

  if (error) {
    logger.error('Error in UrgencyBanner:', error);
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex justify-center p-4" aria-label="Loading urgency banner">
        <LoadingSpinner />
      </div>
    );
  }

  if (!results || !comparison) {
    logger.warn('No results available for urgency banner');
    return null;
  }

  return (
    <ErrorBoundary>
      <motion.div 
        className="bg-gold/10 border-l-4 border-gold p-4 mb-6 rounded-r-lg"
        role="alert"
        aria-live="polite"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <AnimatePresence mode="wait">
          <BannerContent 
            percentile={comparison.percentile}
            remainingSpots={remainingSpots}
            onBookSession={handleBookSession}
          />
        </AnimatePresence>
      </motion.div>
    </ErrorBoundary>
  );
});

UrgencyBanner.displayName = 'UrgencyBanner';