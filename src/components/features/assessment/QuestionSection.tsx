import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Question {
  id: string;
  type: string;
  label: string;
  description?: string;
  options?: string[];
  required?: boolean;
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
  answers = {},
  errors = {},
}) => {
  console.log('QuestionSection - Rendering with section:', section);
  console.log('QuestionSection - Current answers:', answers);

  if (!section?.questions) {
    console.log('QuestionSection - No section or questions provided');
    return null;
  }

  const handleCheckboxChange = (questionId: string, option: string, checked: boolean) => {
    console.log('Handling checkbox change:', { questionId, option, checked });
    const currentAnswers = answers[questionId] || [];
    let newAnswers;
    
    if (checked) {
      newAnswers = [...currentAnswers, option];
    } else {
      newAnswers = currentAnswers.filter((answer: string) => answer !== option);
    }
    
    onAnswer(questionId, newAnswers);
  };

  const handleSelectChange = (questionId: string, value: string) => {
    console.log('Handling select change:', { questionId, value });
    onAnswer(questionId, value);
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">{section.title}</h2>
        {section.description && (
          <p className="text-muted-foreground">{section.description}</p>
        )}
      </div>

      <div className="space-y-6">
        {section.questions.map((question) => (
          <Card key={question.id}>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-base font-semibold">
                    {question.label}
                    {question.required && <span className="text-red-500 ml-1">*</span>}
                  </Label>
                  {question.description && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {question.description}
                    </p>
                  )}
                </div>

                {question.type === 'select' && question.options && (
                  <Select
                    value={answers[question.id] || ''}
                    onValueChange={(value) => handleSelectChange(question.id, value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent>
                      {question.options.map((option) => (
                        <SelectItem key={option} value={option}>
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
                          checked={(answers[question.id] || []).includes(option)}
                          onCheckedChange={(checked) =>
                            handleCheckboxChange(question.id, option, checked as boolean)
                          }
                        />
                        <Label
                          htmlFor={`${question.id}-${option}`}
                          className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {option}
                        </Label>
                      </div>
                    ))}
                  </div>
                )}

                {errors[question.id] && (
                  <p className="text-sm text-red-500 mt-2">{errors[question.id]}</p>
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