import React, { useCallback, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import type { 
  CoreQuestionSection as CoreQuestionSectionType, 
  BaseQuestion,
  QuestionValue,
  ValidationResult 
} from '@/types/assessment/questions';
import { cn } from '@/lib/utils';
import { telemetry } from '@/utils/monitoring/telemetry';
import { createPerformanceMonitor } from '@/utils/monitoring/performance';
import { validateQuestionResponse } from '@/utils/assessment/validation';

const performanceMonitor = createPerformanceMonitor('CoreQuestionSection');

const SLOW_RENDER_THRESHOLD = 100; // ms

/**
 * CoreQuestionSection Component
 * 
 * This component handles the main assessment flow questions.
 * It provides a streamlined interface for basic question types
 * without specialized validation or conditional logic.
 */
interface Props {
  section: CoreQuestionSectionType & { id: string };
  onAnswer: (questionId: string, answer: QuestionValue) => void;
  answers: Record<string, QuestionValue>;
  errors: Record<string, string>;
}

const CoreQuestionSectionBase: React.FC<Props> = ({
  section,
  onAnswer,
  answers,
  errors,
}) => {
  // Track interaction times for analytics
  const interactionStartRef = useRef<Record<string, number>>({});
  const validationTimeoutRef = useRef<NodeJS.Timeout>();
  const renderStartRef = useRef<number>(Date.now());

  // Track slow renders
  useEffect(() => {
    const renderTime = Date.now() - renderStartRef.current;
    if (renderTime > SLOW_RENDER_THRESHOLD) {
      telemetry.track('section_slow_render', {
        sectionId: section.id,
        renderTime,
        questionCount: section.questions.length
      });
    }
    renderStartRef.current = Date.now();
  }, [section]);

  const handleAnswer = useCallback((questionId: string, value: QuestionValue, immediate = false) => {
    const mark = performanceMonitor.start('handle_answer');
    try {
      // Clear any existing validation timeout
      if (validationTimeoutRef.current) {
        clearTimeout(validationTimeoutRef.current);
      }

      const updateAnswer = () => {
        // Calculate interaction time
        const startTime = interactionStartRef.current[questionId];
        const interactionTime = startTime ? Date.now() - startTime : 0;
        delete interactionStartRef.current[questionId];

        // Validate response
        const question = section.questions.find(q => q.id === questionId);
        if (question) {
          const result = validateQuestionResponse(question, value);
          if (!result.isValid) {
            telemetry.track('question_validation_failed', {
              questionId,
              errors: result.errors,
              value: typeof value === 'object' ? JSON.stringify(value) : value
            });
          }
        }

        // Track metrics
        telemetry.track('question_answered', {
          questionId,
          sectionId: section.id,
          interactionTime,
          valueType: typeof value,
          isValid: !errors[questionId],
          responseTime: performanceMonitor.getDuration(mark)
        });

        onAnswer(questionId, value);
      };

      if (immediate) {
        updateAnswer();
      } else {
        // Debounce text input updates
        validationTimeoutRef.current = setTimeout(updateAnswer, 500);
      }
    } finally {
      performanceMonitor.end(mark);
    }
  }, [section, onAnswer, errors]);

  const handleFocus = useCallback((questionId: string) => {
    interactionStartRef.current[questionId] = Date.now();
    
    telemetry.track('question_focused', {
      questionId,
      sectionId: section.id
    });
  }, [section.id]);

  const renderInput = useCallback((question: BaseQuestion) => {
    const mark = performanceMonitor.start('render_input');
    try {
      const value = answers[question.id] || '';
      const error = errors[question.id];
      const options = question.options || [];

      const commonProps = {
        'aria-label': question.label || question.text,
        'aria-invalid': !!error,
        'aria-errormessage': error ? `${question.id}-error` : undefined,
        'aria-required': question.required,
        onFocus: () => handleFocus(question.id),
        id: question.id
      };

      switch (question.type) {
        case 'select':
          return (
            <Select
              value={value as string}
              onValueChange={(newValue) => handleAnswer(question.id, newValue, true)}
              {...commonProps}
            >
              <SelectTrigger 
                className={cn(
                  "bg-background w-full", 
                  error && "border-destructive ring-destructive",
                  "transition-colors duration-200"
                )}
                aria-labelledby={`${question.id}-label`}
              >
                <SelectValue placeholder={question.placeholder || 'Select an option'} />
              </SelectTrigger>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem 
                    key={option} 
                    value={option}
                    className={cn(
                      "text-foreground",
                      "hover:bg-accent hover:text-accent-foreground",
                      "cursor-pointer"
                    )}
                  >
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          );

        case 'multiSelect':
          return (
            <div className="space-y-2">
              {options.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${question.id}-${option}`}
                    checked={(value as string[])?.includes(option)}
                    onCheckedChange={(checked) => {
                      const newValue = checked
                        ? [...(value as string[] || []), option]
                        : (value as string[] || []).filter(v => v !== option);
                      handleAnswer(question.id, newValue, true);
                    }}
                    aria-label={option}
                  />
                  <Label
                    htmlFor={`${question.id}-${option}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          );

        case 'text':
        default:
          return (
            <Input
              {...commonProps}
              type="text"
              placeholder={question.placeholder}
              value={value as string}
              onChange={(e) => handleAnswer(question.id, e.target.value)}
              onBlur={(e) => handleAnswer(question.id, e.target.value, true)}
              className={cn(
                "bg-background",
                error && "border-destructive ring-destructive"
              )}
            />
          );
      }
    } finally {
      performanceMonitor.end(mark);
    }
  }, [answers, errors, handleAnswer, handleFocus]);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold tracking-tight text-black">{section.title}</h2>
        {section.description && (
          <p className="mt-2 text-lg text-black/90">{section.description}</p>
        )}
      </div>

      <div className="space-y-4">
        {section.questions.map((question) => (
          <Card 
            key={question.id} 
            className={cn(
              "border border-input hover:border-primary/50 transition-colors bg-card",
              errors[question.id] && "border-destructive/50"
            )}
          >
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <Label 
                    htmlFor={question.id} 
                    className="text-base font-semibold text-black"
                  >
                    {question.label || question.text}
                    {question.required && <span className="text-destructive ml-1">*</span>}
                  </Label>
                  {question.description && (
                    <p className="mt-1 text-sm text-black/90">
                      {question.description}
                    </p>
                  )}
                </div>

                <div>
                  {renderInput(question)}
                  {errors[question.id] && (
                    <p 
                      id={`${question.id}-error`}
                      className="mt-1 text-sm text-destructive"
                      role="alert"
                    >
                      {errors[question.id]}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export const CoreQuestionSection = React.memo(CoreQuestionSectionBase);