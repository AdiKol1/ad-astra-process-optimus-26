import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { useAssessment } from '@/contexts/AssessmentContext';
import { useAuditForm } from '@/contexts/AuditFormContext';
import { FormFields } from './audit/FormFields';
import { Progress } from '@/components/ui/progress';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import type { AuditFormData } from '@/types/assessment';

const AuditForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setAssessmentData } = useAssessment();
  const { closeAuditForm } = useAuditForm();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [formProgress, setFormProgress] = React.useState(0);
  
  const { control, handleSubmit, watch } = useForm<AuditFormData>({
    defaultValues: {
      employees: '',
      processVolume: '',
      industry: '',
      timelineExpectation: ''
    }
  });

  React.useEffect(() => {
    const subscription = watch((value) => {
      const filledFields = Object.values(value).filter(Boolean).length;
      const totalFields = Object.keys(value).length;
      setFormProgress((filledFields / totalFields) * 100);
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const onSubmit = async (data: AuditFormData) => {
    setIsSubmitting(true);
    
    try {
      // Start the assessment flow
      navigate('/assessment');
      closeAuditForm();
      
      toast({
        title: "Starting Assessment",
        description: "Let's begin optimizing your processes.",
      });
    } catch (error: any) {
      console.error('Error starting assessment:', error);
      toast({
        title: "Error",
        description: error.message || "There was a problem starting your assessment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-space-light p-6 rounded-lg shadow-xl">
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Form Progress</span>
          <span>{Math.round(formProgress)}%</span>
        </div>
        <Progress value={formProgress} className="h-2" />
      </div>

      <FormFields control={control} />

      <Button 
        type="submit"
        className="w-full bg-gold hover:bg-gold-light text-space font-semibold transition-colors duration-200"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <div className="flex items-center gap-2">
            <LoadingSpinner className="h-4 w-4" />
            Processing...
          </div>
        ) : (
          'Start Free Assessment'
        )}
      </Button>
    </form>
  );
};

export default AuditForm;