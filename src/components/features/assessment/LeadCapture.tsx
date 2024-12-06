import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { useAssessment } from '@/contexts/AssessmentContext';
import { saveFormDataToSheet } from '@/utils/googleSheets';
import { useToast } from '@/components/ui/use-toast';
import LeadCaptureForm from './LeadCaptureForm';
import TrustIndicators from '@/components/shared/TrustIndicators';

const LeadCapture: React.FC = () => {
  const navigate = useNavigate();
  const { setAssessmentData, setLeadData } = useAssessment();
  const { toast } = useToast();

  const handleSubmit = async (data: any) => {
    try {
      // First try to save to Google Sheets
      await saveFormDataToSheet(data);
      
      // If successful, update the assessment context
      setLeadData(data);
      setAssessmentData(prev => prev ? {
        ...prev,
        leadData: data
      } : null);

      // Show success message
      toast({
        title: "Success!",
        description: "Your information has been saved successfully.",
      });

      // Navigate to report
      navigate('/assessment/report');
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Error",
        description: "Failed to submit form. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card className="p-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold tracking-tight mb-2">
            Get Your Personalized Assessment Report
          </h2>
          <p className="text-muted-foreground">
            Complete your information to receive your detailed process optimization analysis
          </p>
        </div>

        <LeadCaptureForm onSubmit={handleSubmit} />
      </Card>

      <TrustIndicators className="mt-8" />
    </div>
  );
};

export default LeadCapture;