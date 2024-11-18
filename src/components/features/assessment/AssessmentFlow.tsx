import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card } from '../../ui/card';
import { Button } from '../../ui/button';
import { toast } from '../../ui/use-toast';
import { ProgressBar } from './ProgressBar';
import QuestionSection from './QuestionSection';
import TrustIndicators from '../../shared/TrustIndicators';
import { assessmentQuestions } from '../../../constants/questions';
import { useAssessment } from './AssessmentContext';
import { LoadingSpinner } from '../../ui/loading-spinner';

const AssessmentFlow = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { auditState, setAssessmentData } = useAssessment();
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Initialize assessment data if not already present
    if (!auditState.assessmentData) {
      setAssessmentData({
        responses: {},
        currentStep: 1,
        totalSteps: Object.keys(assessmentQuestions).length
      });
    }
  }, [auditState.assessmentData, setAssessmentData]);

  const sections = Object.values(assessmentQuestions);
  const currentSection = sections[currentSectionIndex];
  const isLastSection = currentSectionIndex === sections.length - 1;

  const handleAnswer = (questionId: string, value: any) => {
    setAnswers(prev => {
      const newAnswers = { ...prev, [questionId]: value };
      // Update assessment data with new answers
      setAssessmentData({
        ...auditState.assessmentData!,
        responses: newAnswers,
        currentStep: currentSectionIndex + 1
      });
      return newAnswers;
    });
  };

  const validateCurrentSection = () => {
    const requiredQuestions = currentSection.questions.filter(q => q.required);
    return requiredQuestions.every(q => answers[q.id]);
  };

  const handleNext = () => {
    if (!validateCurrentSection()) {
      toast({
        title: "Required Fields",
        description: "Please answer all required questions before proceeding.",
        variant: "destructive",
      });
      return;
    }

    if (isLastSection) {
      setIsLoading(true);
      // Navigate to calculator with final assessment data
      setAssessmentData({
        ...auditState.assessmentData!,
        responses: answers,
        currentStep: sections.length
      });
      navigate('/assessment/calculator');
    } else {
      setCurrentSectionIndex(prev => prev + 1);
      setAssessmentData({
        ...auditState.assessmentData!,
        currentStep: currentSectionIndex + 2
      });
    }
  };

  const handleBack = () => {
    if (currentSectionIndex === 0) {
      navigate('/');
    } else {
      setCurrentSectionIndex(prev => prev - 1);
      setAssessmentData({
        ...auditState.assessmentData!,
        currentStep: currentSectionIndex
      });
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-4 text-gray-600">Preparing your assessment...</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <div className="p-6">
        <ProgressBar 
          currentStep={currentSectionIndex + 1}
          totalSteps={sections.length}
        />
        
        <div className="mt-8">
          <QuestionSection
            section={currentSection}
            answers={answers}
            onAnswer={handleAnswer}
          />
        </div>

        <div className="mt-8 flex justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
          >
            {currentSectionIndex === 0 ? 'Exit' : 'Back'}
          </Button>
          <Button
            onClick={handleNext}
          >
            {isLastSection ? 'Calculate Results' : 'Next'}
          </Button>
        </div>

        <div className="mt-8">
          <TrustIndicators />
        </div>
      </div>
    </Card>
  );
};

export default AssessmentFlow;
