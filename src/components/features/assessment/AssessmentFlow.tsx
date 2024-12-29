import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAssessment } from '@/contexts/AssessmentContext';
import QuestionSection from './QuestionSection';
import NavigationControls from './flow/NavigationControls';
import { useAssessmentSteps } from '@/hooks/useAssessmentSteps';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { AssessmentStep } from '@/types/assessmentFlow';

const AssessmentFlow: React.FC = () => {
  const navigate = useNavigate();
  const { 
    assessmentData, 
    setAssessmentData, 
    currentStep, 
    setCurrentStep 
  } = useAssessment();
  const { steps, handleNext, handleBack } = useAssessmentSteps();

  const processAIResponse = async (answer: any) => {
    try {
      const { data, error } = await supabase.functions.invoke('chat-completion', {
        body: { message: JSON.stringify(answer) }
      });

      if (error) {
        console.error('Error calling AI function:', error);
        toast({
          title: "AI Processing Error",
          description: "There was an issue processing your response. Please try again.",
          variant: "destructive",
        });
        return;
      }

      console.log('AI Response:', data);
      return data;
    } catch (error) {
      console.error('Error in AI processing:', error);
      toast({
        title: "Connection Error",
        description: "Unable to connect to AI service. Please try again later.",
        variant: "destructive",
      });
    }
  };

  if (!steps || steps.length === 0) {
    console.warn('No steps provided to AssessmentFlow');
    return null;
  }

  const currentStepData = steps[currentStep];
  if (!currentStepData) {
    console.warn('Invalid step index:', currentStep);
    return null;
  }

  const handleAnswer = async (questionId: string, answer: any) => {
    console.log('Handling answer:', { questionId, answer });
    
    try {
      if (currentStepData.requiresAI) {
        const aiResponse = await processAIResponse(answer);
        if (aiResponse) {
          answer = { ...answer, aiSuggestions: aiResponse };
        }
      }

      const newResponses = {
        ...(assessmentData?.responses || {}),
        [questionId]: answer
      };

      setAssessmentData({
        ...assessmentData,
        responses: newResponses,
        currentStep,
        totalSteps: steps.length
      });

      toast({
        title: "Answer saved",
        description: "Your response has been recorded.",
        duration: 3000
      });
    } catch (error) {
      console.error('Error handling answer:', error);
      toast({
        title: "Error",
        description: "There was a problem saving your answer. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-8">
        <QuestionSection
          section={currentStepData}
          onAnswer={handleAnswer}
          answers={assessmentData?.responses || {}}
        />
        
        <NavigationControls
          currentStep={currentStep}
          totalSteps={steps.length}
          onNext={handleNext}
          onBack={handleBack}
        />
      </div>
    </div>
  );
};

export default AssessmentFlow;