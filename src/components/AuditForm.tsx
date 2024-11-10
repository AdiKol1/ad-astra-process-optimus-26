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
  
  const { control, handleSubmit } = useForm<AuditFormData>({
    defaultValues: {
      employees: '',
      processVolume: '',
      industry: '',
      timelineExpectation: ''
    }
  });

  const onSubmit = async (data: AuditFormData) => {
    try {
      // First transform the data for assessment
      const transformedData = transformAuditFormData(data);
      
      // Then try to save to Google Sheets
      try {
        await saveFormDataToSheet(data);
        toast({
          title: "Data Saved",
          description: "Your information has been successfully recorded.",
        });
      } catch (error) {
        // If Google Sheets fails, we still want to continue with the assessment
        console.error('Google Sheets error:', error);
        toast({
          title: "Note",
          description: "Proceeding with assessment. Some data may not have been saved.",
          variant: "default",
        });
      }

      // Continue with assessment flow
      setAssessmentData(transformedData);
      closeAuditForm();
      
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
        description: "There was a problem starting your assessment. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-space-light p-6 rounded-lg shadow-xl">
      <FormFields 
        control={control}
      />
      <Button 
        type="submit"
        className="w-full bg-gold hover:bg-gold-light text-space font-semibold transition-colors duration-200"
      >
        Start Free Assessment
      </Button>
    </form>
  );
};

export default AuditForm;