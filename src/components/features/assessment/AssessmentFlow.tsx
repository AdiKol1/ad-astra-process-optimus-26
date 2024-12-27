import React from 'react';
import { useAssessment } from '@/contexts/AssessmentContext';
import QuestionSection from './QuestionSection';
import NavigationControls from './flow/NavigationControls';
import { useAssessmentSteps } from '@/hooks/useAssessmentSteps';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { AssessmentStep } from '@/types/assessmentFlow';

interface AssessmentFlowProps {
  currentStep?: number;
  steps?: AssessmentStep[];
}

const AssessmentFlow: React.FC<AssessmentFlowProps> = () => {
  const { assessmentData } = useAssessment();
  const { steps, currentStep, handleAnswer, handleNext, handleBack } = useAssessmentSteps();
  
  console.log('AssessmentFlow rendering with:', { 
    currentStep, 
    stepsCount: steps?.length,
    steps,
    assessmentData 
  });

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
    console.warn(`Invalid step index: ${currentStep}`);
    return null;
  }

  const safeHandleAnswer = async (questionId: string, answer: any) => {
    console.log('Handling answer:', { questionId, answer });
    try {
      // Process answer with AI if needed
      if (currentStepData.requiresAI) {
        const aiResponse = await processAIResponse(answer);
        if (aiResponse) {
          answer = { ...answer, aiSuggestions: aiResponse };
        }
      }

      if (typeof handleAnswer === 'function') {
        handleAnswer(questionId, answer);
      } else {
        console.error('handleAnswer is not a function:', handleAnswer);
      }
    } catch (error) {
      console.error('Error in handleAnswer:', error);
      toast({
        title: "Error",
        description: "There was a problem saving your answer. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <QuestionSection 
        section={currentStepData.data}
        onAnswer={safeHandleAnswer}
        answers={assessmentData?.responses || {}}
      />
      <NavigationControls 
        currentStep={currentStep}
        totalSteps={steps.length}
        onNext={handleNext}
        onBack={handleBack}
      />
    </div>
  );
};

export default AssessmentFlow;