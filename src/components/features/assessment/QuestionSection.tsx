import React from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

interface Question {
  id: string;
  type: 'text' | 'number' | 'select' | 'multiSelect' | 'textarea' | 'multiInput';
  label: string;
  placeholder?: string;
  options?: { value: string; label: string }[] | string[];
  required?: boolean;
  description?: string;
  min?: number;
  max?: number;
  default?: any;
  fields?: { id: string; label: string }[];
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

  const handleMultiInputChange = (questionId: string, fieldId: string, value: string) => {
    const currentValues = answers[questionId] || {};
    onAnswer(questionId, {
      ...currentValues,
      [fieldId]: value
    });
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
            <SelectTrigger className={cn("w-full", error && 'border-red-500')}>
              <SelectValue placeholder={question.placeholder || 'Select an option'} />
            </SelectTrigger>
            <SelectContent>
              {question.options?.map((option) => {
                const optionValue = typeof option === 'string' ? option : option.value;
                const optionLabel = typeof option === 'string' ? option : option.label;
                return (
                  <SelectItem key={optionValue} value={optionValue}>
                    {optionLabel}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        );

      case 'multiSelect':
        return (
          <div className="space-y-2">
            {question.options?.map((option) => {
              const optionValue = typeof option === 'string' ? option : option.value;
              const optionLabel = typeof option === 'string' ? option : option.label;
              const isSelected = Array.isArray(value) && value.includes(optionValue);
              
              return (
                <div key={optionValue} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${question.id}-${optionValue}`}
                    checked={isSelected}
                    onCheckedChange={(checked) => {
                      const currentValues = Array.isArray(value) ? value : [];
                      if (checked) {
                        handleInputChange(question.id, [...currentValues, optionValue]);
                      } else {
                        handleInputChange(
                          question.id,
                          currentValues.filter((v) => v !== optionValue)
                        );
                      }
                    }}
                  />
                  <label
                    htmlFor={`${question.id}-${optionValue}`}
                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {optionLabel}
                  </label>
                </div>
              );
            })}
          </div>
        );

      case 'multiInput':
        if (!question.fields) return null;
        return (
          <div className="space-y-4">
            {question.fields.map((field) => (
              <div key={field.id} className="space-y-2">
                <Label className="text-sm text-gray-600">{field.label}</Label>
                <Input
                  type="number"
                  value={(value?.[field.id] || '').toString()}
                  onChange={(e) => handleMultiInputChange(question.id, field.id, e.target.value)}
                  className={cn(error && 'border-red-500')}
                  min={question.min}
                  max={question.max}
                />
              </div>
            ))}
          </div>
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
            value={value || question.default || ''}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
            placeholder={question.placeholder}
            className={cn(error && 'border-red-500')}
            min={question.min}
            max={question.max}
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