import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useAssessmentStore } from '@/stores/assessment';
import { motion, AnimatePresence } from 'framer-motion';
import { telemetry } from '@/utils/monitoring/telemetry';
import { logger } from '@/utils/logger';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface ExitIntentModalProps {
  className?: string;
  onClose?: () => void;
}

interface AssessmentStore {
  results: Record<string, any> | null;
  currentStep: string;
  progress: number;
  error: Error | null;
  setError: (error: Error | null) => void;
}

const ANIMATION_DURATION = 0.3;
const MODAL_VARIANTS = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30
    }
  },
  exit: { opacity: 0, scale: 0.95 }
};

export const ExitIntentModal: React.FC<ExitIntentModalProps> = React.memo(({ 
  className = '',
  onClose
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const { results, currentStep, progress, setError } = useAssessmentStore() as unknown as AssessmentStore;

  const shouldShowModal = useMemo(() => {
    return !isVisible && 
           typeof currentStep === 'string' &&
           progress > 0 && // Only show if user has started assessment
           !localStorage.getItem('exitModalDismissed');
  }, [isVisible, currentStep, progress]);

  const handleError = useCallback((error: Error) => {
    setError(error);
    logger.error('Error in ExitIntentModal:', {
      message: error.message,
      stack: error.stack
    });
  }, [setError]);

  const handleMouseLeave = useCallback((e: MouseEvent) => {
    try {
      if (e.clientY <= 0 && shouldShowModal) {
        setIsVisible(true);
        telemetry.track('exit_intent_modal_shown', {
          currentStep,
          progress,
          hasResults: !!results,
          timestamp: new Date().toISOString()
        });
        logger.info('Exit intent modal shown', { currentStep, progress });
      }
    } catch (error) {
      const err = error as Error;
      handleError(err);
    }
  }, [shouldShowModal, currentStep, progress, results, handleError]);

  useEffect(() => {
    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [handleMouseLeave]);

  const handleContinue = useCallback(() => {
    try {
      telemetry.track('exit_intent_modal_continue', {
        currentStep,
        progress,
        timestamp: new Date().toISOString()
      });
      logger.info('User continued from exit modal');
      setIsVisible(false);
      onClose?.();
    } catch (error) {
      const err = error as Error;
      handleError(err);
    }
  }, [currentStep, progress, handleError, onClose]);

  const handleDismiss = useCallback(() => {
    try {
      telemetry.track('exit_intent_modal_dismiss', {
        currentStep,
        progress,
        timestamp: new Date().toISOString()
      });
      logger.info('User dismissed exit modal');
      localStorage.setItem('exitModalDismissed', 'true');
      setIsVisible(false);
      onClose?.();
    } catch (error) {
      const err = error as Error;
      handleError(err);
    }
  }, [currentStep, progress, handleError, onClose]);

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: ANIMATION_DURATION }}
          className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 ${className}`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="exit-modal-title"
          aria-describedby="exit-modal-description"
          onClick={handleDismiss} // Close on backdrop click
        >
          <motion.div
            variants={MODAL_VARIANTS}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-xl"
            onClick={e => e.stopPropagation()} // Prevent closing when clicking modal
            tabIndex={-1}
          >
            <motion.h2 
              id="exit-modal-title" 
              className="text-2xl font-bold mb-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              Wait! Don't Leave Yet
            </motion.h2>
            <motion.p 
              id="exit-modal-description"
              className="text-gray-600 mb-6"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              You're {Math.round(progress)}% through unlocking valuable insights about your business processes.
              Complete the assessment to receive your personalized optimization report.
            </motion.p>
            <motion.div 
              className="flex flex-col space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Button
                onClick={handleContinue}
                className="bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                aria-label="Continue with assessment"
                autoFocus
              >
                Continue Assessment
              </Button>
              <Button
                onClick={handleDismiss}
                variant="ghost"
                className="text-gray-600 hover:text-gray-800 transition-colors"
                aria-label="Dismiss modal"
              >
                Maybe Later
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

ExitIntentModal.displayName = 'ExitIntentModal';