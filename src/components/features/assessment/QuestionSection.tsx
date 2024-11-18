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
    const baseInputClasses = "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";
    
    switch (question.type) {
      case 'select':
        return (
          <select
            className={baseInputClasses}
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
            className={baseInputClasses}
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
            className={baseInputClasses}
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
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
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