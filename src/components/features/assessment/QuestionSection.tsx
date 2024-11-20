import React from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface Question {
  id: string;
  type: 'text' | 'number' | 'select' | 'multiSelect' | 'textarea';
  label: string;
  placeholder?: string;
  options?: { value: string; label: string }[];
  required?: boolean;
  description?: string;
}

interface QuestionSectionProps {
  section: {
    title: string;
    description?: string;
    questions: Question[];
  };
  onAnswer: (questionId: string, answer: any) => void;
  answers: Record<string, any>;
  errors: Record<string, string>;
}

const QuestionSection: React.FC<QuestionSectionProps> = ({
  section,
  onAnswer,
  answers,
  errors,
}) => {
  const handleInputChange = (questionId: string, value: any) => {
    onAnswer(questionId, value);
  };

  const renderQuestion = (question: Question) => {
    const error = errors[question.id];
    const value = answers[question.id];

    switch (question.type) {
      case 'select':
        return (
          <Select
            value={value?.toString() || ''}
            onValueChange={(val) => handleInputChange(question.id, val)}
          >
            <SelectTrigger className={cn(error && 'border-red-500')}>
              <SelectValue placeholder={question.placeholder || 'Select an option'} />
            </SelectTrigger>
            <SelectContent>
              {question.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'multiSelect':
        return (
          <Select
            value={value?.toString() || ''}
            onValueChange={(val) => handleInputChange(question.id, val)}
            multiple
          >
            <SelectTrigger className={cn(error && 'border-red-500')}>
              <SelectValue placeholder={question.placeholder || 'Select options'} />
            </SelectTrigger>
            <SelectContent>
              {question.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'textarea':
        return (
          <Textarea
            value={value || ''}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
            placeholder={question.placeholder}
            className={cn(error && 'border-red-500')}
          />
        );

      case 'number':
        return (
          <Input
            type="number"
            value={value || ''}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
            placeholder={question.placeholder}
            className={cn(error && 'border-red-500')}
          />
        );

      default:
        return (
          <Input
            type="text"
            value={value || ''}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
            placeholder={question.placeholder}
            className={cn(error && 'border-red-500')}
          />
        );
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-8">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">{section.title}</h2>
          {section.description && (
            <p className="text-gray-600">{section.description}</p>
          )}
        </div>

        <div className="space-y-6">
          {section.questions.map((question) => (
            <div key={question.id} className="space-y-2">
              <Label className="flex items-start gap-1">
                {question.label}
                {question.required && (
                  <span className="text-red-500">*</span>
                )}
              </Label>
              {question.description && (
                <p className="text-sm text-gray-500 mb-2">{question.description}</p>
              )}
              {renderQuestion(question)}
              {errors[question.id] && (
                <p className="text-sm text-red-500">{errors[question.id]}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default QuestionSection;