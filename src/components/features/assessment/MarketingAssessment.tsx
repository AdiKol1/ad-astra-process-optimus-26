import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { useAssessment } from '@/contexts/AssessmentContext';
import QuestionSection from './QuestionSection';
import { marketingQuestions } from '@/constants/questions/marketing';
import { NavigationButtons } from './NavigationButtons';

const MarketingAssessment = () => {
  const navigate = useNavigate();
  const { assessmentData, setAssessmentData } = useAssessment();
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const handleAnswer = (questionId: string, answer: any) => {
    if (!assessmentData) {
      setAssessmentData({
        responses: { [questionId]: answer },
        currentStep: 0,
        completed: false
      });
      return;
    }

    setAssessmentData({
      ...assessmentData,
      responses: {
        ...assessmentData.responses,
        [questionId]: answer
      }
    });
  };

  const validateResponses = () => {
    const newErrors: Record<string, string> = {};
    marketingQuestions.questions.forEach(question => {
      if (question.required && !assessmentData?.responses[question.id]) {
        newErrors[question.id] = 'This field is required';
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateResponses()) {
      navigate('/assessment/capture');
    }
  };

  const handleBack = () => {
    navigate('/assessment/processes');
  };

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
          canProgress={Object.keys(errors).length === 0}
        />
      </Card>
    </div>
  );
};

export default MarketingAssessment;