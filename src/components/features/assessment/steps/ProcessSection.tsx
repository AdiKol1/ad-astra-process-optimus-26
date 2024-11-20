import React from 'react';
import { Question } from '../types';
import QuestionSection from '../QuestionSection';

const processSection = {
  id: 'process',
  title: 'Process Assessment',
  description: 'Help us understand your current business processes and automation needs.',
  questions: [
    {
      id: 'processComplexity',
      text: 'How would you rate the complexity of your current business processes?',
      type: 'select',
      required: true,
      options: [
        'Low - Simple, linear processes',
        'Medium - Some complexity with decision points',
        'High - Complex with multiple dependencies',
        'Very High - Highly complex with many variables'
      ]
    },
    {
      id: 'automationLevel',
      text: 'What is your current level of process automation?',
      type: 'select',
      required: true,
      options: [
        'None - Fully manual processes',
        'Basic - Some spreadsheet automation',
        'Moderate - Using basic workflow tools',
        'Advanced - Integrated automation systems'
      ]
    },
    {
      id: 'painPoints',
      text: 'What are your biggest process-related pain points?',
      type: 'select',
      required: true,
      options: [
        'Manual Data Entry',
        'Process Delays',
        'Communication Gaps',
        'Error Rates',
        'Lack of Visibility',
        'Resource Constraints'
      ]
    },
    {
      id: 'processGoals',
      text: 'What are your primary goals for process improvement?',
      type: 'text',
      required: true,
      placeholder: 'e.g., Reduce processing time, improve accuracy'
    }
  ]
};

interface ProcessSectionProps {
  onAnswer: (questionId: string, answer: any) => void;
  answers: Record<string, any>;
  errors?: Record<string, string>;
}

const ProcessSection: React.FC<ProcessSectionProps> = ({ onAnswer, answers, errors }) => {
  return (
    <QuestionSection
      section={processSection}
      answers={answers}
      onAnswer={onAnswer}
      errors={errors}
    />
  );
};

export default ProcessSection;
