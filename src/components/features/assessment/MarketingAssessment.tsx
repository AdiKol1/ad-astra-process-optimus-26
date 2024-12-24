import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { useAssessment } from '@/contexts/assessment/AssessmentContext';
import { QuestionSection } from './sections';
import { marketingQuestions } from '@/constants/questions/marketing';
import { NavigationButtons } from './NavigationButtons';
import { logger } from '@/utils/logger';

const MarketingAssessment = () => {
  const navigate = useNavigate();
  const { assessmentData, setAssessmentData } = useAssessment();
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const handleAnswer = useCallback((questionId: string, answer: any) => {
    if (!assessmentData) {
      setAssessmentData({
        responses: { [questionId]: answer },
        currentStep: 0,
        completed: false
      });
      return;
    }

    const newResponses = {
      ...assessmentData.responses,
      [questionId]: answer
    };

    setAssessmentData({
      ...assessmentData,
      responses: newResponses
    });

    // Clear error for this question if it exists
    if (errors[questionId]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[questionId];
        return newErrors;
      });
    }
  }, [assessmentData, setAssessmentData, errors]);

  const validateResponses = useCallback(() => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    marketingQuestions.questions.forEach(question => {
      if (question.required) {
        const response = assessmentData?.responses[question.id];
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
  }, [assessmentData?.responses]);

  const handleNext = useCallback(() => {
    if (validateResponses()) {
      navigate('/assessment/capture');
    }
  }, [navigate, validateResponses]);

  const handleBack = useCallback(() => {
    navigate('/assessment/processes');
  }, [navigate]);

  const hasAllRequiredAnswers = React.useMemo(() => {
    if (!assessmentData?.responses) return false;
    
    return marketingQuestions.questions
      .filter(q => q.required)
      .every(q => {
        const response = assessmentData.responses[q.id];
        return response !== undefined && response !== '' && 
          !(Array.isArray(response) && response.length === 0);
      });
  }, [assessmentData?.responses]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card className="p-6">
        <QuestionSection
          section={marketingQuestions}
          onAnswer={handleAnswer}
          answers={assessmentData?.responses || {}}
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