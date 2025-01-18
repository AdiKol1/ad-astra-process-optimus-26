import React, { useCallback, useRef } from 'react';
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

/**
 * CoreQuestionSection Component
 * 
 * This component handles the main assessment flow questions.
 * It provides a streamlined interface for basic question types
 * without specialized validation or conditional logic.
 */
interface Props {
  section: CoreQuestionSectionType;
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

  const handleAnswer = useCallback((questionId: string, value: QuestionValue) => {
    const mark = performanceMonitor.start('handle_answer');
    try {
      // Calculate interaction time
      const startTime = interactionStartRef.current[questionId];
      const interactionTime = startTime ? Date.now() - startTime : 0;
      delete interactionStartRef.current[questionId];

      // Validate response
      const question = section.questions.find(q => q.id === questionId);
      if (question) {
        const validationResult = validateQuestionResponse(question, value);
        if (!validationResult.isValid) {
          telemetry.track('question_validation_failed', {
            questionId,
            errors: validationResult.errors,
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
        'aria-invalid': !!error,
        'aria-errormessage': error ? `${question.id}-error` : undefined,
        onFocus: () => handleFocus(question.id)
      };

      switch (question.type) {
        case 'select':
          return (
            <Select
              value={value as string}
              onValueChange={(newValue) => handleAnswer(question.id, newValue)}
              {...commonProps}
            >
              <SelectTrigger 
                className={cn(
                  "bg-background w-full", 
                  error && "border-destructive ring-destructive",
                  "transition-colors duration-200"
                )}
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
              {options.map((option) => {
                const isSelected = Array.isArray(value) && value.includes(option);
                return (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox
                      id={`${question.id}-${option}`}
                      checked={isSelected}
                      onCheckedChange={(checked) => {
                        const currentValue = Array.isArray(value) ? value : [];
                        const newValue = checked
                          ? [...currentValue, option]
                          : currentValue.filter((v) => v !== option);
                        handleAnswer(question.id, newValue);
                      }}
                      {...commonProps}
                    />
                    <Label 
                      htmlFor={`${question.id}-${option}`} 
                      className="text-black font-normal cursor-pointer"
                    >
                      {option}
                    </Label>
                  </div>
                );
              })}
            </div>
          );

        case 'text':
        case 'email':
          return (
            <Input
              type={question.type}
              id={question.id}
              value={value as string}
              onChange={(e) => handleAnswer(question.id, e.target.value)}
              placeholder={question.placeholder}
              className={cn("bg-background text-black", error && "border-destructive")}
              {...commonProps}
            />
          );

        case 'textarea':
          return (
            <Textarea
              id={question.id}
              value={value as string}
              onChange={(e) => handleAnswer(question.id, e.target.value)}
              placeholder={question.placeholder}
              className={cn("bg-background text-black", error && "border-destructive")}
              {...commonProps}
            />
          );

        default:
          telemetry.track('unknown_question_type', {
            questionId: question.id,
            type: question.type
          });
          return null;
      }
    } finally {
      performanceMonitor.end(mark);
    }
  }, [answers, errors, handleAnswer, handleFocus]);

  // Track section render performance
  React.useEffect(() => {
    const mark = performanceMonitor.start('section_render');
    return () => {
      const renderTime = performanceMonitor.end(mark);
      if (renderTime > 100) { // 100ms threshold
        telemetry.track('section_slow_render', {
          sectionId: section.id,
          questionCount: section.questions.length,
          renderTime
        });
      }
    };
  }, [section]);

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
                    {question.text || question.label}
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