import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useToast } from '@/components/ui/use-toast';
import { transformAuditFormData } from '@/utils/assessmentFlow';
import { saveFormDataToSheet } from '@/utils/googleSheets';
import type { AuditFormData } from '@/types/assessment';
import { Button } from '@/components/ui/button';
import { useAssessment } from '@/contexts/AssessmentContext';
import { useAuditForm } from '@/contexts/AuditFormContext';
import { FormFields } from './audit/FormFields';

const AuditForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setAssessmentData } = useAssessment();
  const { closeAuditForm } = useAuditForm();
  
  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<AuditFormData>({
    defaultValues: {
      employees: '',
      processVolume: '',
      industry: '',
      timelineExpectation: ''
    }
  });

  const onSubmit = async (data: AuditFormData) => {
    try {
      // Save to Google Sheet
      await saveFormDataToSheet(data);
      
      // Transform data for assessment
      const transformedData = transformAuditFormData(data);
      
      setAssessmentData(transformedData);
      closeAuditForm();
      
      toast({
        title: "Form Submitted Successfully",
        description: "Your information has been saved and we're ready to begin the assessment.",
      });

      navigate('/assessment', { 
        state: { 
          formData: data,
          assessmentData: transformedData 
        },
        replace: true
      });
      
    } catch (error) {
      console.error('Error processing form:', error);
      toast({
        title: "Error",
        description: "There was a problem submitting your information. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-space-light p-6 rounded-lg shadow-xl">
      <FormFields 
        control={control}
        errors={errors}
        isSubmitting={isSubmitting}
      />

      <Button 
        type="submit"
        className="w-full bg-gold hover:bg-gold-light text-space font-semibold transition-colors duration-200"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Processing...' : 'Start Free Assessment'}
      </Button>
    </form>
  );
};

export default AuditForm;