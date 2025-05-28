import React from 'react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ErrorBoundary } from '@/components/error/ErrorBoundary';
import type { BaseQuestion } from '@/types/assessment/core';

type QuestionValue = string | number | string[];

interface Props {
  question: BaseQuestion;
  answer: QuestionValue;
  error?: string;
  onAnswer: (answer: QuestionValue) => void;
}

export const SpecializedQuestion: React.FC<Props> = ({
  question,
  answer,
  error,
  onAnswer
}) => {
  const handleChange = (value: QuestionValue) => {
    onAnswer(value);
  };

  const renderInput = () => {
    switch (question.type) {
      case 'text':
      case 'email':
      case 'tel':
        return (
          <Input
            type={question.type}
            value={answer as string || ''}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={question.placeholder}
            className={error ? 'border-red-500' : ''}
          />
        );

      case 'number':
        return (
          <Input
            type="number"
            value={answer as number || ''}
            onChange={(e) => handleChange(Number(e.target.value))}
            placeholder={question.placeholder}
            min={question.validation?.min}
            max={question.validation?.max}
            className={error ? 'border-red-500' : ''}
          />
        );

      case 'select':
        return (
          <Select 
            value={answer as string || ''} 
            onValueChange={(value: string) => handleChange(value)}
          >
            <SelectTrigger className={error ? 'border-red-500' : ''}>
              <SelectValue placeholder={question.placeholder} />
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

      case 'multiselect':
        const selectedValues = (answer as string[]) || [];
        return (
          <div className="space-y-2">
            {question.options?.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`${question.id}-${option.value}`}
                  checked={selectedValues.includes(option.value)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      handleChange([...selectedValues, option.value]);
                    } else {
                      handleChange(selectedValues.filter((v: string) => v !== option.value));
                    }
                  }}
                />
                <Label htmlFor={`${question.id}-${option.value}`}>
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <ErrorBoundary>
      <div className="space-y-2">
        <Label>
          {question.label}
          {question.required && <span className="text-red-500 ml-1">*</span>}
        </Label>
        {question.description && (
          <p className="text-sm text-gray-500 mb-2">{question.description}</p>
        )}
        {renderInput()}
        {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
      </div>
    </ErrorBoundary>
  );
}; 