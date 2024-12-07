import React from 'react';
import QuestionSection from '../QuestionSection';

interface QuestionRendererProps {
  section: any;
  onAnswer: (questionId: string, answer: any) => void;
  answers: Record<string, any>;
}

const QuestionRenderer: React.FC<QuestionRendererProps> = ({
  section,
  onAnswer,
  answers,
}) => {
  if (!section) return null;

  return (
    <QuestionSection
      section={section}
      onAnswer={onAnswer}
      answers={answers}
    />
  );
};

export default QuestionRenderer;