import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAssessment } from '@/contexts/AssessmentContext';
import QuestionSection from './QuestionSection';
import { processesQuestions } from '@/constants/questions/processes';
import { NavigationButtons } from './NavigationButtons';

const ProcessAssessment = () => {
  const navigate = useNavigate();
  const { assessmentData, setAssessmentData } = useAssessment();
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  console.log('ProcessAssessment - Current assessment data:', assessmentData);

  const handleAnswer = (questionId: string, answer: any) => {
    console.log('Process answer received:', { questionId, answer });
    
    if (!assessmentData) {
      console.log('No existing assessment data, creating new');
      setAssessmentData({
        responses: { [questionId]: answer },
        currentStep: 0,
        completed: false
      });
      return;
    }

    console.log('Updating existing assessment data');
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
    processesQuestions.questions.forEach(question => {
      if (question.required && !assessmentData?.responses[question.id]) {
        newErrors[question.id] = 'This field is required';
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateResponses()) {
      navigate('/assessment/marketing');
    }
  };

  const handleBack = () => {
    navigate('/assessment');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card className="p-6">
        <QuestionSection
          section={processesQuestions}
          onAnswer={handleAnswer}
          answers={assessmentData?.responses || {}}
          errors={errors}
        />
        
        <NavigationButtons
          step={1}
          onNext={handleNext}
          onPrev={handleBack}
          canProgress={Object.keys(errors).length === 0}
        />
      </Card>
    </div>
  );
};

export default ProcessAssessment;