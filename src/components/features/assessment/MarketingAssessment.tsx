import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../../components/ui/card';
import { useAssessment } from '../../../hooks/useAssessment';
import { QuestionSection } from './sections';
import { marketingQuestions } from '../../../constants/questions/marketing';
import { NavigationButtons } from './NavigationButtons';
import { logger } from '../../../utils/logger';
import { AssessmentResponses } from '../../../types/assessment';

const MarketingAssessment = () => {
  const navigate = useNavigate();
  const { state, setAssessmentData } = useAssessment();
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const handleAnswer = useCallback(async (questionId: string, answer: any) => {
    try {
      const typedQuestionId = questionId as keyof AssessmentResponses;
      
      if (!state.responses) {
        await Promise.resolve(setAssessmentData({
          responses: { [typedQuestionId]: answer },
          currentStep: 0,
          completed: false
        }));
        return;
      }

      const newResponses = {
        ...state.responses,
        [typedQuestionId]: answer
      };

      await Promise.resolve(setAssessmentData({
        ...state,
        responses: newResponses
      }));

      // Clear error for this question if it exists
      if (errors[questionId]) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[questionId];
          return newErrors;
        });
      }
    } catch (error) {
      logger.error('Error handling answer:', error);
    }
  }, [state, setAssessmentData, errors]);

  const validateResponses = useCallback(() => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    marketingQuestions.questions.forEach(question => {
      if (question.required) {
        const questionId = question.id as keyof AssessmentResponses;
        const response = state.responses[questionId];
        const isEmpty = response === undefined || response === '' || 
          (Array.isArray(response) && response.length === 0);
        
        if (isEmpty) {
          newErrors[question.id] = 'This field is required';
          isValid = false;
        }
      }
    });

    logger.info('Validation result:', { isValid, errors: newErrors });
    setErrors(newErrors);
    return isValid;
  }, [state.responses]);

  const handleNext = useCallback(() => {
    if (validateResponses()) {
      navigate('/assessment/capture');
    }
  }, [navigate, validateResponses]);

  const handleBack = useCallback(() => {
    navigate('/assessment/processes');
  }, [navigate]);

  const hasAllRequiredAnswers = React.useMemo(() => {
    if (!state.responses) return false;
    
    return marketingQuestions.questions
      .filter(q => q.required)
      .every(q => {
        const questionId = q.id as keyof AssessmentResponses;
        const response = state.responses[questionId];
        return response !== undefined && response !== '' && 
          !(Array.isArray(response) && response.length === 0);
      });
  }, [state.responses]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card className="p-6">
        <QuestionSection
          section={marketingQuestions}
          onAnswer={handleAnswer}
          answers={state.responses || {}}
          errors={errors}
        />
        
        <NavigationButtons
          step={2}
          onNext={handleNext}
          onPrev={handleBack}
          canProgress={hasAllRequiredAnswers && Object.keys(errors).length === 0}
        />
      </Card>
    </div>
  );
};

export default React.memo(MarketingAssessment);
