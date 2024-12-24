import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { useAssessment } from '@/contexts/assessment/AssessmentContext';
import { saveFormDataToSheet } from '@/utils/googleSheets';
import { toast } from '@/hooks/use-toast';
import LeadCaptureForm from './LeadCaptureForm';
import TrustIndicators from '@/components/shared/TrustIndicators';

const LeadCapture: React.FC = () => {
  const navigate = useNavigate();
  const { setAssessmentData, setLeadData } = useAssessment();

  const handleSubmit = async (data: any) => {
    try {
      console.log('Submitting lead data:', data);
      
      // Save to Google Sheets (now just logging)
      await saveFormDataToSheet(data);
      
      // Update assessment context
      setLeadData(data);
      setAssessmentData(prev => prev ? {
        ...prev,
        leadData: data
      } : null);

      // Show success message
      toast({
        title: "Information Saved",
        description: "Your information has been recorded successfully.",
      });

      // Navigate to report
      navigate('/assessment/report');
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Note",
        description: "Your assessment will continue, but some data may not have been saved.",
        variant: "default",
      });
      // Still navigate to report even if sheet save fails
      navigate('/assessment/report');
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
