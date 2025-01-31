import React, { useCallback, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { useAssessmentStore } from '@/stores/assessment';
import { SpecializedQuestion } from './sections/SpecializedQuestion';
import { marketingQuestions } from '@/constants/questions/marketing';
import { NavigationButtons } from './ui/NavigationButtons';
import { ErrorBoundary } from '@/components/error/ErrorBoundary';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { logger } from '@/utils/logger';
import { telemetry } from '@/utils/monitoring/telemetry';
import type { AssessmentResponses } from '@/types/assessment/state';
import type { BaseQuestion } from '@/types/assessment/core';
import { motion, AnimatePresence } from 'framer-motion';

interface ValidationError {
  field: string;
  message: string;
}

interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

interface AssessmentStore {
  responses: AssessmentResponses;
  updateResponses: (updates: Partial<AssessmentResponses>) => void;
  setStep: (step: string) => void;
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  validateStep: (step: string) => ValidationResult;
  clearValidationErrors: () => void;
  setError: (error: string | null) => void;
}

const ANIMATION_DURATION = 0.3;
const ERROR_DISPLAY_DURATION = 5000; // 5 seconds

const QuestionCard: React.FC<{
  question: BaseQuestion;
  answer: any;
  error?: string;
  onAnswer: (answer: any) => void;
}> = React.memo(({ question, answer, error, onAnswer }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: ANIMATION_DURATION }}
  >
    <SpecializedQuestion
      question={question}
      answer={answer}
      error={error}
      onAnswer={onAnswer}
    />
  </motion.div>
));

QuestionCard.displayName = 'QuestionCard';

export const MarketingAssessment: React.FC = () => {
  const navigate = useNavigate();
  const { 
    responses, 
    updateResponses, 
    setStep,
    isLoading,
    setLoading,
    validateStep,
    clearValidationErrors,
    setError: setGlobalError
  } = useAssessmentStore() as AssessmentStore;
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [lastAnsweredQuestion, setLastAnsweredQuestion] = useState<string | null>(null);

  const questions = useMemo(() => marketingQuestions.questions, []);

  const handleAnswer = useCallback((questionId: keyof AssessmentResponses, answer: string | string[] | number) => {
    logger.info('Marketing answer received:', { questionId, answer });
    
    try {
      // Process the answer based on question type
      let processedAnswer: string | string[] | number = answer;
      if (questionId === 'marketingBudget') {
        processedAnswer = Number(answer) || 0;
      } else if (questionId === 'toolStack' || questionId === 'metricsTracking') {
        processedAnswer = Array.isArray(answer) ? answer.map(String) : [String(answer)];
      }
      
      updateResponses({
        [questionId]: processedAnswer
      });
      
      // Track answer for analytics
      telemetry.track('marketing_answer_updated', {
        questionId,
        hasValue: Boolean(processedAnswer),
        timestamp: new Date().toISOString()
      });
      
      // Clear error for this question if it exists
      if (errors[questionId]) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[questionId];
          return newErrors;
        });
      }

      setLastAnsweredQuestion(String(questionId));
    } catch (error) {
      const err = error as Error;
      logger.error('Error updating marketing answer:', { 
        questionId, 
        error: err.message,
        stack: err.stack
      });
      setErrors(prev => ({
        ...prev,
        [questionId]: 'Failed to update answer. Please try again.'
      }));
    }
  }, [errors, updateResponses]);

  const validateResponses = useCallback(() => {
    const validation = validateStep('technology');
    if (!validation.isValid) {
      const newErrors: Record<string, string> = {};
      validation.errors.forEach((error) => {
        newErrors[error.field] = error.message;
      });
      setErrors(newErrors);

      // Auto-scroll to first error
      const firstErrorField = validation.errors[0]?.field;
      if (firstErrorField) {
        const element = document.getElementById(`question-${firstErrorField}`);
        element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

      return false;
    }
    return true;
  }, [validateStep]);

  const handleNext = useCallback(async () => {
    if (!validateResponses()) {
      logger.error('Marketing validation failed:', errors);
      return;
    }

    setLoading(true);
    try {
      clearValidationErrors();
      setStep('results');
      
      telemetry.track('marketing_assessment_completed', {
        questionsAnswered: Object.keys(responses).length,
        timestamp: new Date().toISOString()
      });

      navigate('/assessment/results');
    } catch (error) {
      const err = error as Error;
      logger.error('Error navigating to results:', { 
        message: err.message, 
        stack: err.stack 
      });
      setGlobalError('Failed to proceed to results. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [navigate, validateResponses, clearValidationErrors, setStep, setLoading, responses, setGlobalError]);

  const handleBack = useCallback(() => {
    try {
      setStep('process');
      navigate('/assessment/process');
    } catch (err) {
      const error = err as Error;
      logger.error('Error navigating back:', { 
        message: error.message,
        stack: error.stack 
      });
      setGlobalError('Failed to go back. Please try again.');
    }
  }, [navigate, setStep, setGlobalError]);

  if (isLoading) {
    return (
      <div 
        className="flex justify-center items-center min-h-[400px]"
        aria-label="Loading marketing assessment"
      >
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <motion.div 
        className="container mx-auto px-4 py-8 max-w-4xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: ANIMATION_DURATION }}
      >
        <Card className="p-6">
          <div className="space-y-8">
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: ANIMATION_DURATION }}
            >
              <h1 className="text-2xl font-bold">Marketing Assessment</h1>
              <p className="text-gray-600 mt-2">
                Help us understand your marketing processes and challenges
              </p>
            </motion.div>

            <AnimatePresence mode="wait">
              {questions.map((question) => (
                <QuestionCard
                  key={question.id}
                  question={question as BaseQuestion}
                  answer={responses[question.id as keyof AssessmentResponses]}
                  error={errors[question.id]}
                  onAnswer={(answer) => handleAnswer(question.id as keyof AssessmentResponses, answer)}
                />
              ))}
            </AnimatePresence>

            <NavigationButtons
              onNext={handleNext}
              onBack={handleBack}
              nextLabel="View Results"
              disabled={Object.keys(errors).length > 0}
              loading={isLoading}
              aria-label="Assessment navigation"
            />
          </div>
        </Card>
      </motion.div>
    </ErrorBoundary>
  );
};

MarketingAssessment.displayName = 'MarketingAssessment';
