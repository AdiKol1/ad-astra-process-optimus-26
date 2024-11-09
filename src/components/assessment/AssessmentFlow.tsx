import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ProgressBar } from './ProgressBar';
import { QuestionSection } from './QuestionSection';
import { ValuePreview } from '../shared/ValuePreview';
import TrustIndicators from '@/components/TrustIndicators';
import { NavigationButtons } from './NavigationButtons';
import { assessmentQuestions } from '@/constants/questions';

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

type AssessmentAnswers = Record<string, string | number | string[]>;

const AssessmentFlow = () => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<AssessmentAnswers>({});

  const handleAnswer = (questionId: string, value: string | number | string[]) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleNext = () => {
    const totalSteps = Object.keys(assessmentQuestions).length;
    setStep(prev => Math.min(prev + 1, totalSteps - 1));
  };

  const handlePrev = () => {
    setStep(prev => Math.max(prev - 1, 0));
  };

  const getCurrentSection = (stepIndex: number): Section => {
    const sections = Object.values(assessmentQuestions);
    if (stepIndex >= sections.length) {
      console.error('Invalid step index');
      return sections[0]; // Fallback to first section
    }
    return sections[stepIndex];
  };

  const canProgress = () => {
    const currentSection = getCurrentSection(step);
    const requiredQuestions = currentSection.questions.filter(q => q.required);
    return requiredQuestions.every(q => {
      const answer = answers[q.id];
      return answer !== undefined && answer !== '';
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-gradient-to-r from-space to-space-light text-white p-8 rounded-lg mb-6">
        <h1 className="text-3xl font-bold mb-4">
          Process Automation Assessment
        </h1>
        <p className="text-lg opacity-90">
          Discover your automation potential in less than 2 minutes
        </p>
      </div>

      <ProgressBar 
        currentStep={step} 
        totalSteps={Object.keys(assessmentQuestions).length} 
      />

      <Card className="mt-6">
        <CardContent className="p-6">
          <QuestionSection 
            section={getCurrentSection(step)}
            answers={answers}
            onUpdate={handleAnswer}
          />
          
          <NavigationButtons 
            step={step}
            onNext={handleNext}
            onPrev={handlePrev}
            canProgress={canProgress()}
          />
        </CardContent>
      </Card>

      <ValuePreview 
        answers={answers}
        step={step}
      />

      <TrustIndicators />
    </div>
  );
};

export default AssessmentFlow;