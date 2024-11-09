import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ProgressBar } from './ProgressBar';
import { QuestionSection } from './QuestionSection';
import { ValuePreview } from '../shared/ValuePreview';
import { TrustIndicators } from '../shared/TrustIndicators';
import { NavigationButtons } from './NavigationButtons';
import { assessmentQuestions } from '@/constants/questions';

const AssessmentFlow = () => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});

  const handleAnswer = (questionId: string, value: any) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleNext = () => {
    setStep(prev => Math.min(prev + 1, Object.keys(assessmentQuestions).length - 1));
  };

  const handlePrev = () => {
    setStep(prev => Math.max(prev - 1, 0));
  };

  const getCurrentSection = (stepIndex: number) => {
    const sections = Object.values(assessmentQuestions);
    return sections[stepIndex];
  };

  const canProgress = () => {
    const currentSection = getCurrentSection(step);
    const requiredQuestions = currentSection.questions.filter(q => q.required);
    return requiredQuestions.every(q => answers[q.id]);
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