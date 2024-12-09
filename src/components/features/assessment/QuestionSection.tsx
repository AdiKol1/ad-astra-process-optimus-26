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
          <Card key={question.id} className="border border-input hover:border-primary/50 transition-colors">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor={question.id} className="text-base font-semibold text-foreground">
                    {question.text || question.label}
                    {question.required && <span className="text-destructive ml-1">*</span>}
                  </Label>
                  {question.description && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {question.description}
                    </p>
                  )}
                </div>

                {(question.type === 'text' || question.type === 'email' || question.type === 'tel') && (
                  <Input
                    id={question.id}
                    type={question.type}
                    placeholder={question.placeholder}
                    value={answers[question.id] || ''}
                    onChange={(e) => handleInputChange(question.id, e.target.value)}
                    className="w-full max-w-md"
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

                {question.type === 'multiSelect' && question.options && (
                  <div className="grid gap-4">
                    {question.options.map((option) => (
                      <div key={option} className="flex items-center space-x-3">
                        <Checkbox
                          id={`${question.id}-${option}`}
                          checked={answers[question.id]?.includes(option)}
                          onCheckedChange={(checked) => {
                            const currentAnswers = answers[question.id] || [];
                            const newAnswers = checked
                              ? [...currentAnswers, option]
                              : currentAnswers.filter((a: string) => a !== option);
                            onAnswer(question.id, newAnswers);
                          }}
                        />
                        <Label
                          htmlFor={`${question.id}-${option}`}
                          className="text-sm font-normal"
                        >
                          {option}
                        </Label>
                      </div>
                    ))}
                  </div>
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