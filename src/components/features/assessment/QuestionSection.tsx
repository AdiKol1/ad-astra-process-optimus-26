import React from 'react';

interface Question {
  id: string;
  text: string;
  type: 'text' | 'number' | 'select';
  options?: string[];
  required?: boolean;
}

interface Section {
  title: string;
  description: string;
  questions: Question[];
}

interface QuestionSectionProps {
  section: Section;
  answers: Record<string, any>;
  onAnswer: (questionId: string, value: any) => void;
}

export const QuestionSection: React.FC<QuestionSectionProps> = ({
  section,
  answers,
  onAnswer,
}) => {
  const renderQuestion = (question: Question) => {
    switch (question.type) {
      case 'select':
        return (
          <select
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={answers[question.id] || ''}
            onChange={(e) => onAnswer(question.id, e.target.value)}
            required={question.required}
          >
            <option value="">Select an option</option>
            {question.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      case 'number':
        return (
          <input
            type="number"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={answers[question.id] || ''}
            onChange={(e) => onAnswer(question.id, Number(e.target.value))}
            min="1"
            max="10"
            required={question.required}
          />
        );
      default:
        return (
          <input
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={answers[question.id] || ''}
            onChange={(e) => onAnswer(question.id, e.target.value)}
            required={question.required}
          />
        );
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">{section.title}</h2>
      <p className="text-gray-600 mb-8">{section.description}</p>
      
      <div className="space-y-6">
        {section.questions.map((question) => (
          <div key={question.id} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {question.text}
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {renderQuestion(question)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestionSection;