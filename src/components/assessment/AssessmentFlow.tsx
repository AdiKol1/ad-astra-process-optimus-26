import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { ProgressBar } from './ProgressBar';
import { QuestionSection } from './QuestionSection';
import { ValuePreview } from '../shared/ValuePreview';
import TrustIndicators from '@/components/TrustIndicators';
import { assessmentQuestions } from '@/constants/questions';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [answers, setAnswers] = useState<AssessmentAnswers>({});

  const sections = Object.values(assessmentQuestions);
  const currentSection = sections[currentSectionIndex];
  const isLastSection = currentSectionIndex === sections.length - 1;

  const handleAnswer = (questionId: string, value: string | number | string[]) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
    // Show progress update toast
    const totalQuestions = sections.reduce((acc, section) => acc + section.questions.length, 0);
    const progress = Math.round((Object.keys(answers).length + 1) / totalQuestions * 100);
    
    if (progress % 25 === 0) { // Show toast at 25%, 50%, 75%, 100%
      toast({
        title: `${progress}% Complete!`,
        description: "Keep going, you're doing great!",
      });
    }
  };

  const validateCurrentSection = () => {
    const requiredQuestions = currentSection.questions.filter(q => q.required);
    return requiredQuestions.every(q => {
      const answer = answers[q.id];
      return answer !== undefined && answer !== '' && 
        (typeof answer !== 'object' || (Array.isArray(answer) && answer.length > 0));
    });
  };

  const handleNext = () => {
    if (!validateCurrentSection()) {
      toast({
        title: "Required Fields Missing",
        description: "Please complete all required fields before proceeding.",
        variant: "destructive",
      });
      return;
    }

    if (isLastSection) {
      toast({
        title: "Assessment Complete!",
        description: "Generating your customized recommendations...",
      });
      navigate('/assessment/results');
      return;
    }

    setCurrentSectionIndex(prev => prev + 1);
    toast({
      title: "Progress Saved",
      description: "Moving to next section...",
    });
  };

  const handlePrev = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(prev => prev - 1);
    }
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
        currentStep={currentSectionIndex} 
        totalSteps={sections.length} 
      />

      <Card className="mt-6">
        <CardContent className="p-6">
          <QuestionSection 
            section={currentSection}
            answers={answers}
            onUpdate={handleAnswer}
          />
          
          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={handlePrev}
              disabled={currentSectionIndex === 0}
            >
              Previous
            </Button>
            <Button
              onClick={handleNext}
              disabled={!validateCurrentSection()}
            >
              {isLastSection ? 'Complete Assessment' : 'Next Section'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <ValuePreview 
        answers={answers}
        step={currentSectionIndex}
      />

      <TrustIndicators />
    </div>
  );
};

export default AssessmentFlow;