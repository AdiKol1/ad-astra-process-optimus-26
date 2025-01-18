import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAssessment } from '@/contexts/assessment/AssessmentContext';

const ThankYou: React.FC = () => {
  const navigate = useNavigate();
  const { leadData } = useAssessment();

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card className="p-6 text-center">
        <h1 className="text-3xl font-bold mb-4">Thank You!</h1>
        <p className="text-xl text-muted-foreground mb-6">
          {leadData?.firstName ? `Thank you ${leadData.firstName}! ` : ''}
          Your assessment report has been generated successfully.
        </p>
        
        <div className="space-y-4">
          <p className="text-muted-foreground">
            We've sent a copy of your report to {leadData?.email || 'your email'}.
          </p>
          
          <Button 
            onClick={() => navigate('/assessment/report')}
            className="mt-4"
          >
            View Your Report
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ThankYou;