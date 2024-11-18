import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../ui/card';
import { Button } from '../../ui/button';
import { LoadingSpinner } from '../../ui/loading-spinner';
import { useAssessment } from './AssessmentContext';

const Calculator = () => {
  const navigate = useNavigate();
  const { auditState, setAssessmentData } = useAssessment();
  const [isCalculating, setIsCalculating] = React.useState(true);

  React.useEffect(() => {
    if (!auditState.assessmentData) {
      navigate('/assessment');
      return;
    }

    // Simulate calculation
    const timer = setTimeout(() => {
      // Calculate score based on responses
      const responses = auditState.assessmentData.responses;
      const score = Object.values(responses).reduce((acc: number, response: any) => {
        return acc + (typeof response === 'number' ? response : 0);
      }, 0) / Object.keys(responses).length;

      setAssessmentData({
        ...auditState.assessmentData,
        score,
        recommendations: [
          'Automate Manual Tasks',
          'Optimize Communication',
          'Streamline Workflows'
        ]
      });
      
      setIsCalculating(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [auditState.assessmentData, navigate, setAssessmentData]);

  if (!auditState.assessmentData) {
    return null;
  }

  if (isCalculating) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Calculating Your Results
          </h2>
          <p className="text-gray-600 mb-8">
            Please wait while we analyze your responses...
          </p>
          <LoadingSpinner />
        </div>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Calculation Complete
        </h2>
        <p className="text-gray-600 mb-8">
          We've analyzed your responses and prepared your report.
        </p>
        <Button
          onClick={() => navigate('/assessment/report')}
        >
          View Your Report
        </Button>
      </div>
    </Card>
  );
};

export default Calculator;