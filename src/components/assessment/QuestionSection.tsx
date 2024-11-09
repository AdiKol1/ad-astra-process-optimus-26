import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

interface Question {
  id: string;
  type: string;
  label: string;
  options?: string[];
  required?: boolean;
  min?: number;
  tooltip?: string;
}

interface Section {
  title: string;
  questions: Question[];
}

interface QuestionSectionProps {
  section: Section;
  answers: Record<string, any>;
  onUpdate: (id: string, value: any) => void;
}

export const QuestionSection: React.FC<QuestionSectionProps> = ({
  section,
  answers,
  onUpdate,
}) => {
  const handleMultiSelect = (questionId: string, option: string, checked: boolean) => {
    const currentValues = answers[questionId] || [];
    const newValues = checked
      ? [...currentValues, option]
      : currentValues.filter((value: string) => value !== option);
    onUpdate(questionId, newValues);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">{section.title}</h2>
      {section.questions.map((question) => (
        <div key={question.id} className="space-y-2">
          <Label htmlFor={question.id}>
            {question.label}
            {question.required && <span className="text-red-500 ml-1">*</span>}
          </Label>
          
          {question.type === 'select' && (
            <Select
              value={answers[question.id] || ''}
              onValueChange={(value) => onUpdate(question.id, value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                {question.options?.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {question.type === 'number' && (
            <Input
              type="number"
              id={question.id}
              value={answers[question.id] || ''}
              onChange={(e) => onUpdate(question.id, e.target.value)}
              min={question.min}
              required={question.required}
              className="w-full text-white bg-space-light border-gold/20"
            />
          )}

          {question.type === 'multiSelect' && (
            <div className="space-y-2">
              {question.options?.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${question.id}-${option}`}
                    checked={(answers[question.id] || []).includes(option)}
                    onCheckedChange={(checked) => 
                      handleMultiSelect(question.id, option, checked as boolean)
                    }
                  />
                  <Label htmlFor={`${question.id}-${option}`}>{option}</Label>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};