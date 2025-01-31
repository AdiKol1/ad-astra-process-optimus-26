import React, { useCallback, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { useAssessmentStore } from '@/stores/assessment';
import { SpecializedQuestion } from './sections/SpecializedQuestion';
import { processesQuestions } from '@/constants/questions/processes';
import { NavigationButtons } from './ui/NavigationButtons';
import { calculateAssessmentResults } from '@/utils/assessment/calculations';
import { ErrorBoundary } from '@/components/error/ErrorBoundary';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { logger } from '@/utils/logger';
import { telemetry } from '@/utils/monitoring/telemetry';
import type { BaseQuestion, ValidationError } from '@/types/assessment/core';
import type { AssessmentResponses, AssessmentResults } from '@/types/assessment';
import { motion, AnimatePresence } from 'framer-motion';

interface QuestionProps {
  question: BaseQuestion;
  answer: any;
  error?: string;
  onAnswer: (answer: any) => void;
}

type StoreResponses = {
  // Process-related fields
  manualProcesses?: string[];
  processComplexity?: string;
  industry?: string;
  
  // Marketing-related fields
  marketingSpend?: number;
  customerVolume?: number;
  metricsTracking?: string[];
  
  // Team-related fields
  teamSize?: number;
  teamStructure?: string;
  teamChallenges?: string[];
  
  // Technology-related fields
  toolStack?: string[];
  currentTech?: string[];
  integrationNeeds?: string[];
  techChallenges?: string[];
  
  // Additional fields
  budgetRange?: string;
  timeline?: string;
  priorities?: string[];
  
  [key: string]: any;
};

interface AssessmentStore {
  responses: StoreResponses;
  updateResponses: (updates: Partial<StoreResponses>) => void;
  setResults: (results: AssessmentResults) => void;
  setStep: (step: string) => void;
  setLoading: (loading: boolean) => void;
  isLoading: boolean;
  setError: (error: string | null) => void;
  validateStep: (step: string) => { isValid: boolean; errors: ValidationError[] };
  clearValidationErrors: () => void;
}

const ANIMATION_DURATION = 0.3;
const STAGGER_DELAY = 0.1;

const QuestionCard: React.FC<QuestionProps> = React.memo(({ question, answer, error, onAnswer }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: ANIMATION_DURATION }}
    className="relative"
    id={`question-${question.id}`}
  >
    <SpecializedQuestion
      question={question}
      answer={answer}
      error={error}
      onAnswer={onAnswer}
    />
    {error && (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="absolute top-0 right-0 text-red-600 text-sm"
        role="alert"
      >
        {error}
      </motion.div>
    )}
  </motion.div>
));

QuestionCard.displayName = 'QuestionCard';

export const ProcessAssessment: React.FC = () => {
  const navigate = useNavigate();
  const { 
    responses, 
    updateResponses, 
    setResults, 
    setStep, 
    setLoading,
    isLoading,
    setError,
    validateStep,
    clearValidationErrors 
  } = useAssessmentStore() as AssessmentStore;
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [lastAnsweredQuestion, setLastAnsweredQuestion] = useState<string | null>(null);

  const questions = useMemo(() => processesQuestions.questions, []);

  const handleAnswer = useCallback((questionId: keyof StoreResponses, answer: any) => {
    logger.info('Process answer received:', { questionId, answer });
    
    try {
      // Convert values to proper types
      let processedAnswer = answer;
      if (questionId === 'teamSize') {
        processedAnswer = Number(answer) || 0;
      } else if (questionId === 'manualProcesses' || questionId === 'toolStack') {
        processedAnswer = Array.isArray(answer) ? answer : [answer];
      }
      
      updateResponses({
        [questionId]: processedAnswer
      });

      // Track answer for analytics
      telemetry.track('process_answer_updated', {
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
      logger.error('Error updating process answer:', { 
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
    const validation = validateStep('process');
    if (!validation.isValid) {
      const newErrors: Record<string, string> = {};
      validation.errors.forEach((error: ValidationError) => {
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
      logger.error('Validation failed:', errors);
      return;
    }

    setLoading(true);
    try {
      const results = calculateAssessmentResults(responses as AssessmentResponses);
      if (!results) {
        throw new Error('Failed to calculate results');
      }

      setResults(results);
      clearValidationErrors();
      
      telemetry.track('process_assessment_completed', {
        questionsAnswered: Object.keys(responses).length,
        timestamp: new Date().toISOString()
      });

      logger.info('Results updated, navigating to results page');
      setStep('results');
      navigate('/assessment/results');
    } catch (error) {
      const err = error as Error;
      logger.error('Error processing results:', { 
        message: err.message, 
        stack: err.stack 
      });
      setError('Failed to process results. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [navigate, validateResponses, responses, setResults, clearValidationErrors, setStep, setLoading, setError]);

  const handleBack = useCallback(() => {
    try {
      setStep('team');
      navigate('/assessment/team');
    } catch (err) {
      const error = err as Error;
      logger.error('Error navigating back:', { 
        message: error.message,
        stack: error.stack 
      });
      setError('Failed to go back. Please try again.');
    }
  }, [navigate, setStep, setError]);

  if (isLoading) {
    return (
      <div 
        className="flex justify-center items-center min-h-[400px]"
        aria-label="Loading process assessment"
      >
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <motion.div 
        className="w-full max-w-4xl mx-auto"
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
              <h1 className="text-2xl font-bold">Process Assessment</h1>
              <p className="text-gray-600 mt-2">
                Help us understand your current processes and challenges
              </p>
            </motion.div>

            <AnimatePresence mode="wait">
              {questions.map((question, index) => (
                <motion.div
                  key={question.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ 
                    duration: ANIMATION_DURATION,
                    delay: index * STAGGER_DELAY
                  }}
                >
                  <QuestionCard
                    question={question as BaseQuestion}
                    answer={responses[question.id as keyof StoreResponses]}
                    error={errors[question.id]}
                    onAnswer={(answer) => handleAnswer(question.id as keyof StoreResponses, answer)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>

            {errors.submit && (
              <motion.div 
                className="text-red-600 text-center p-4 bg-red-50 rounded"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                role="alert"
                aria-live="assertive"
              >
                {errors.submit}
              </motion.div>
            )}

            <NavigationButtons
              onBack={handleBack}
              onNext={handleNext}
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

ProcessAssessment.displayName = 'ProcessAssessment';