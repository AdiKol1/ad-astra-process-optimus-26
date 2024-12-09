import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Question {
  id: string;
  type: string;
  label: string;
  text?: string;
  description?: string;
  options?: string[];
  required?: boolean;
  placeholder?: string;
}

interface QuestionSectionProps {
  section: {
    title: string;
    description?: string;
    questions: Question[];
  };
  onAnswer: (questionId: string, answer: any) => void;
  answers: Record<string, any>;
  errors?: Record<string, string>;
}

const QuestionSection: React.FC<QuestionSectionProps> = ({
  section,
  onAnswer,
  answers,
  errors = {}
}) => {
  console.log('QuestionSection rendering with:', { section, answers, errors });

  if (!section || !section.questions) {
    console.log('No section or questions provided');
    return null;
  }

  const handleInputChange = (questionId: string, value: string) => {
    onAnswer(questionId, value);
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-foreground">{section.title}</h2>
        {section.description && (
          <p className="text-muted-foreground">{section.description}</p>
        )}
      </div>

      <div className="space-y-6">
        {section.questions.map((question) => (
          <Card key={question.id} className="border border-input bg-card hover:bg-accent/5 transition-colors">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor={question.id} className="text-base font-medium text-foreground">
                    {question.text}
                    {question.required && <span className="text-destructive ml-1">*</span>}
                  </Label>
                </div>

                {(question.type === 'text' || question.type === 'email' || question.type === 'tel') && (
                  <Input
                    id={question.id}
                    type={question.type}
                    placeholder={question.placeholder}
                    value={answers[question.id] || ''}
                    onChange={(e) => handleInputChange(question.id, e.target.value)}
                    className="w-full max-w-md bg-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    required={question.required}
                  />
                )}

                {question.type === 'select' && question.options && (
                  <Select
                    value={answers[question.id] || ''}
                    onValueChange={(value) => onAnswer(question.id, value)}
                  >
                    <SelectTrigger id={question.id} className="w-full max-w-md text-foreground">
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent>
                      {question.options.map((option) => (
                        <SelectItem key={option} value={option} className="text-foreground">
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}

                {errors[question.id] && (
                  <p className="text-sm text-destructive mt-1">{errors[question.id]}</p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default QuestionSection;
