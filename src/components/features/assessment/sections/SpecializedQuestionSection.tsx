import React, { ChangeEvent } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { logger } from '@/utils/logger';
import { SpecializedQuestionSection, SpecializedQuestion } from '@/types/assessment/questions';
import { AssessmentResponses } from '@/types/assessment';

/**
 * SpecializedQuestionSection Component
 * 
 * This component handles specialized assessment sections with advanced features:
 * - Detailed validation
 * - Loading states
 * - Conditional rendering
 * - Comprehensive logging
 */
interface Props {
  section: SpecializedQuestionSection;
  onAnswer: (questionId: string, answer: any) => void;
  answers: AssessmentResponses;
  errors?: Record<string, string>;
  loading?: boolean;
}

const SpecializedQuestionSectionComponent: React.FC<Props> = ({
  section,
  onAnswer,
  answers,
  errors = {},
  loading = false
}) => {
  logger.info('SpecializedQuestionSection rendering', { section, answers, errors }, 'assessment');

  if (!section || !section.questions) {
    logger.warn('No section or questions provided', undefined, 'assessment');
    return null;
  }

  const handleInputChange = (question: SpecializedQuestion, value: any) => {
    try {
      logger.info('Input change', { questionId: question.id, value }, 'assessment');
      
      // Basic validation
      if (question.required && (!value || (Array.isArray(value) && value.length === 0))) {
        logger.warn('Required field empty', { questionId: question.id }, 'assessment');
        return;
      }

      // Type-specific validation
      switch (question.type) {
        case 'text':
        case 'email':
        case 'tel':
          if (typeof value !== 'string') {
            logger.warn('Invalid input type', { questionId: question.id, type: question.type }, 'assessment');
            return;
          }
          break;
        case 'select':
          if (!question.options?.includes(value)) {
            logger.warn('Invalid select option', { questionId: question.id, value }, 'assessment');
            return;
          }
          break;
        case 'multiSelect':
          if (!Array.isArray(value) || !value.every(v => question.options?.includes(v))) {
            logger.warn('Invalid multiSelect options', { questionId: question.id, value }, 'assessment');
            return;
          }
          break;
      }
      
      // Custom validation if exists
      if (question.validation && !question.validation(value)) {
        logger.warn('Custom validation failed', { questionId: question.id, value }, 'assessment');
        return;
      }
      
      onAnswer(question.id, value);
    } catch (error) {
      logger.error('Error handling input change:', error);
    }
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
        <h2 className="text-2xl font-bold text-black">{section.title}</h2>
        {section.description && (
          <p className="text-black/90">{section.description}</p>
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
        {section.questions.map((question) => {
          // Check conditional display
          if (question.conditionalDisplay && !question.conditionalDisplay(answers)) {
            return null;
          }

          return (
            <Card 
              key={question.id} 
              className={`border bg-card transition-colors ${
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
                      className="text-base font-semibold text-black"
                    >
                      {question.text || question.label}
                      {question.required && <span className="text-destructive ml-1">*</span>}
                    </Label>
                    {question.description && (
                      <p className="text-sm text-black/90 mt-1">
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
                      onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange(question, e.target.value)}
                      className="w-full max-w-md bg-background text-black"
                      required={question.required}
                      aria-invalid={errors[question.id] ? 'true' : 'false'}
                      aria-errormessage={errors[question.id] ? `${question.id}-error` : undefined}
                    />
                  )}

                  {question.type === 'select' && question.options && (
                    <Select
                      defaultValue={String(answers[question.id] || '')}
                      onValueChange={(value: string) => {
                        if (value) {
                          handleInputChange(question, value);
                        }
                      }}
                    >
                      <SelectTrigger 
                        id={question.id} 
                        className="w-full max-w-md bg-background text-black"
                      >
                        <SelectValue 
                          placeholder={
                            question.placeholder || 
                            (question.required ? "Please select an option" : "Select an option (optional)")
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {question.options.map((option) => (
                          <SelectItem 
                            key={option} 
                            value={option}
                            className="text-black"
                          >
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
                            checked={(answers[question.id] as string[] | undefined)?.includes(option)}
                            onCheckedChange={(checked: boolean) => {
                              const currentAnswers = answers[question.id] as string[] || [];
                              const newAnswers = checked
                                ? [...currentAnswers, option]
                                : currentAnswers.filter((a: string) => a !== option);
                              handleInputChange(question, newAnswers);
                            }}
                          />
                          <Label
                            htmlFor={`${question.id}-${option}`}
                            className="text-sm font-normal text-black"
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
                    >
                      {errors[question.id]}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default SpecializedQuestionSectionComponent;
