import React from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';

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
              <option value="">Select an option</option>
              {question.options?.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
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
            />
          )}
        </div>
      ))}
    </div>
  );
};