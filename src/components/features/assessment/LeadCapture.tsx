import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { useAssessment } from '@/contexts/AssessmentContext';
import LeadCaptureForm from './LeadCaptureForm';
import TrustIndicators from '@/components/shared/TrustIndicators';

const LeadCapture: React.FC = () => {
  const navigate = useNavigate();
  const { setLeadData } = useAssessment();

  const handleSubmit = (data: any) => {
    setLeadData(data);
    navigate('/assessment/report');
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