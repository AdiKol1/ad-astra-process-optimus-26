import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAssessment } from '@/contexts/AssessmentContext';
import { useToast } from '@/hooks/use-toast';
import QuestionSection from './QuestionSection';
import { processesQuestions } from '@/constants/questions/processes';
import { NavigationButtons } from './NavigationButtons';

const ProcessAssessment = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { assessmentData, setAssessmentData } = useAssessment();
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  console.log('[ProcessAssessment] Initializing with data:', {
    hasData: !!assessmentData,
    responses: assessmentData?.responses
  });

  React.useEffect(() => {
    // Validate that we have the required initial data
    if (!assessmentData?.responses?.industry || !assessmentData?.responses?.teamSize) {
      console.log('[ProcessAssessment] Missing required initial data, redirecting to assessment');
      toast({
        title: "Missing Information",
        description: "Please complete the initial assessment questions first.",
        variant: "destructive",
      });
      navigate('/assessment');
      return;
    }
  }, [assessmentData, navigate, toast]);

  const handleAnswer = (questionId: string, answer: any) => {
    console.log('[ProcessAssessment] Answer received:', { questionId, answer });
    
    if (!assessmentData) {
      console.log('[ProcessAssessment] Creating new assessment data');
      setAssessmentData({
        responses: { [questionId]: answer },
        currentStep: 0,
        totalSteps: 4,
        completed: false
      });
      return;
    }

    console.log('[ProcessAssessment] Updating existing assessment data');
    setAssessmentData({
      ...assessmentData,
      responses: {
        ...assessmentData.responses,
        [questionId]: answer
      }
    });
  };

  const validateResponses = () => {
    const newErrors: Record<string, string> = {};
    processesQuestions.questions.forEach(question => {
      if (question.required && !assessmentData?.responses[question.id]) {
        newErrors[question.id] = 'This field is required';
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    console.log('[ProcessAssessment] Attempting to navigate to next step');
    if (validateResponses()) {
      navigate('/assessment/marketing');
    } else {
      toast({
        title: "Required Fields",
        description: "Please complete all required questions before continuing.",
        variant: "destructive",
      });
    }
  };

  const handleBack = () => {
    navigate('/assessment');
  };

  // If we're still loading or validating data, show nothing
  if (!assessmentData) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card className="p-6">
        <QuestionSection
          section={processesQuestions}
          onAnswer={handleAnswer}
          answers={assessmentData?.responses || {}}
          errors={errors}
        />
        
        <NavigationButtons
          step={1}
          onNext={handleNext}
          onPrev={handleBack}
          canProgress={Object.keys(errors).length === 0}
        />
      </Card>
    </div>
  );
};

export default ProcessAssessment;