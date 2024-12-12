import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { logger } from '@/utils/logger';

interface Question {
  id: string;
  type: string;
  label: string;
  text?: string;
  description?: string;
  options?: string[];
  required?: boolean;
  placeholder?: string;
  validation?: (value: any) => boolean;
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
  loading?: boolean;
}

const QuestionSection: React.FC<QuestionSectionProps> = ({
  section,
  onAnswer,
  answers,
  errors = {},
  loading = false
}) => {
  logger.info('QuestionSection rendering', { section, answers, errors });

  if (!section || !section.questions) {
    logger.warn('No section or questions provided');
    return null;
  }

  const handleInputChange = (question: Question, value: any) => {
    logger.info('Input change', { questionId: question.id, value });
    
    // Validate input if validation function exists
    if (question.validation && !question.validation(value)) {
      logger.warn('Input validation failed', { questionId: question.id, value });
      return;
    }
    
    onAnswer(question.id, value);
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="space-y-2">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="border border-input">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <Skeleton className="h-6 w-1/2" />
                  <Skeleton className="h-10 w-full max-w-md" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-foreground">{section.title}</h2>
        {section.description && (
          <p className="text-muted-foreground">{section.description}</p>
        )}
      </div>

      {Object.keys(errors).length > 0 && (
        <Alert variant="destructive">
          <AlertDescription>
            Please correct the errors below before proceeding.
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-6">
        {section.questions.map((question) => (
          <Card 
            key={question.id} 
            className={`border transition-colors ${
              errors[question.id] 
                ? 'border-destructive' 
                : 'border-input hover:border-primary/50'
            }`}
          >
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <Label 
                    htmlFor={question.id} 
                    className={`text-base font-semibold ${
                      errors[question.id] ? 'text-destructive' : 'text-foreground'
                    }`}
                  >
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
                    onChange={(e) => handleInputChange(question, e.target.value)}
                    className={`w-full max-w-md ${
                      errors[question.id] ? 'border-destructive' : ''
                    }`}
                    required={question.required}
                    aria-invalid={errors[question.id] ? 'true' : 'false'}
                    aria-errormessage={errors[question.id] ? `${question.id}-error` : undefined}
                  />
                )}

                {question.type === 'select' && question.options && (
                  <Select
                    value={answers[question.id] || ''}
                    onValueChange={(value) => handleInputChange(question, value)}
                  >
                    <SelectTrigger 
                      id={question.id} 
                      className={`w-full max-w-md ${
                        errors[question.id] ? 'border-destructive' : ''
                      }`}
                    >
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
                          checked={answers[question.id]?.includes(option)}
                          onCheckedChange={(checked) => {
                            const currentAnswers = answers[question.id] || [];
                            const newAnswers = checked
                              ? [...currentAnswers, option]
                              : currentAnswers.filter((a: string) => a !== option);
                            handleInputChange(question, newAnswers);
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
                  <p 
                    id={`${question.id}-error`}
                    className="text-sm text-destructive mt-1"
                    role="alert"
                  >
                    {errors[question.id]}
                  </p>
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