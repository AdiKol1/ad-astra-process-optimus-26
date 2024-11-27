import React from 'react';
import { Card } from '@/components/ui/card';
import { useAssessment } from '@/contexts/AssessmentContext';
import QuestionSection from './QuestionSection';
import { processesQuestions } from '@/constants/questions/processes';

const ProcessAssessment = () => {
  const { assessmentData, setAssessmentData } = useAssessment();

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

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card className="p-6">
        <QuestionSection
          section={processesQuestions}
          onAnswer={handleAnswer}
          answers={assessmentData?.responses || {}}
          errors={{}}
        />
      </Card>
    </div>
  );
};

export default ProcessAssessment;