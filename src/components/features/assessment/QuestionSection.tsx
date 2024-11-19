import React from 'react';
import { Card } from '@/components/ui/card';

interface Question {
  id: string;
  text: string;
  type: string;
  options?: string[];
  required?: boolean;
  placeholder?: string;
}

interface Section {
  id: string;
  title: string;
  description: string;
  questions: Question[];
}

interface QuestionSectionProps {
  section: Section;
  answers: Record<string, any>;
  onAnswer: (questionId: string, value: any) => void;
}

const QuestionSection: React.FC<QuestionSectionProps> = ({
  section,
  answers,
  onAnswer,
}) => {
  const handleInputChange = (questionId: string, value: any) => {
    onAnswer(questionId, value);
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-6">{section.title}</h2>
      <p className="text-gray-600 mb-8">{section.description}</p>
      <div className="space-y-6">
        {section.questions.map((question) => (
          <div key={question.id} className="space-y-2">
            <label
              htmlFor={question.id}
              className="block text-sm font-medium text-gray-700"
            >
              {question.text}
              {question.required && <span className="text-red-500">*</span>}
            </label>
            {question.type === 'text' && (
              <input
                type="text"
                id={question.id}
                value={answers[question.id] || ''}
                onChange={(e) => handleInputChange(question.id, e.target.value)}
                placeholder={question.placeholder}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required={question.required}
              />
            )}
            {question.type === 'select' && question.options && (
              <select
                id={question.id}
                value={answers[question.id] || ''}
                onChange={(e) => handleInputChange(question.id, e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required={question.required}
              >
                <option value="">Select an option</option>
                {question.options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};

export default QuestionSection;