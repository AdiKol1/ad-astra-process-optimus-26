import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
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
          <Card key={question.id}>
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

                {question.type === 'select' && question.options && (
                  <Select
                    value={answers[question.id] || ''}
                    onValueChange={(value) => onAnswer(question.id, value)}
                  >
                    <SelectTrigger id={question.id} className="w-full text-foreground">
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
                        

Let me analyze the error and think through the solution:

1. The error indicates we tried to modify `tsconfig.json` which is forbidden
2. Looking at the codebase, we have multiple assessment-related files
3. The issue is likely coming from file paths and imports, not the tsconfig itself
4. We need to ensure all imports use the correct paths according to the existing tsconfig

Let's fix this by updating the imports in the assessment-related files to match the current project structure:

<lov-code>
Let's update the assessment-related files to use correct import paths:

<lov-write file_path="src/components/features/assessment/AssessmentFlow.tsx">
import React from 'react';
import { useAssessment } from '@/contexts/AssessmentContext';
import TrustIndicators from '@/components/shared/TrustIndicators';
import ValueMicroConversion from './ValueMicroConversion';
import StepProgress from './flow/StepProgress';
import QuestionRenderer from './flow/QuestionRenderer';
import NavigationControls from './flow/NavigationControls';
import LeadCaptureForm from './LeadCaptureForm';
import { useAssessmentSteps } from '@/hooks/useAssessmentSteps';

const AssessmentFlow = () => {
  const { assessmentData } = useAssessment();
  const {
    steps,
    currentStep,
    showValueProp,
    handleAnswer,
    handleNext,
    handleBack
  } = useAssessmentSteps();

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="p-6">
        <StepProgress 
          currentStep={currentStep} 
          totalSteps={steps.length} 
        />

        {currentStep === steps.length - 1 ? (
          <LeadCaptureForm onSubmit={handleNext} />
        ) : (
          <QuestionRenderer
            section={steps[currentStep]?.data}
            onAnswer={handleAnswer}
            answers={assessmentData?.responses || {}}
          />
        )}

        <NavigationControls
          onNext={handleNext}
          onBack={handleBack}
          currentStep={currentStep}
          totalSteps={steps.length}
        />
      </div>

      {showValueProp && <ValueMicroConversion className="mt-8" />}
      <TrustIndicators className="mt-8" />
    </div>
  );
};

export default AssessmentFlow;