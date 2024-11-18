import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../ui/card';
import { Button } from '../../ui/button';
import { useAssessment } from './AssessmentContext';

const ReportGenerator = () => {
  const navigate = useNavigate();
  const { auditState } = useAssessment();

  React.useEffect(() => {
    if (!auditState.assessmentData?.score) {
      navigate('/assessment');
    }
  }, [auditState.assessmentData, navigate]);

  if (!auditState.assessmentData?.score) {
    return null;
  }

  const score = Math.round(auditState.assessmentData.score * 100);
  const recommendations = auditState.assessmentData.recommendations || [];

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <div className="p-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Your Process Optimization Report
          </h2>
          <p className="text-gray-600">
            Based on your responses, here's our analysis and recommendations.
          </p>
        </div>

        <div className="space-y-8">
          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Current Process Efficiency
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-4xl font-bold text-blue-600 mb-2">{score}%</div>
              <p className="text-gray-600">
                {score >= 80 ? 'Your processes are highly optimized!' :
                score >= 60 ? 'Your processes are performing above average, but there\'s room for improvement.' :
                'Your processes have significant room for optimization.'}
              </p>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Key Recommendations
            </h3>
            <ul className="space-y-4">
              {recommendations.map((recommendation, index) => (
                <li key={index} className="bg-gray-50 p-4 rounded-lg">
                  <div className="font-medium text-gray-900">{recommendation}</div>
                  <p className="text-gray-600">
                    {getRecommendationDescription(recommendation)}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="mt-8 flex justify-center">
          <Button
            onClick={() => navigate('/services')}
            className="mr-4"
          >
            Explore Our Services
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/')}
          >
            Back to Home
          </Button>
        </div>
      </div>
    </Card>
  );
};

const getRecommendationDescription = (recommendation: string): string => {
  const descriptions: Record<string, string> = {
    'Automate Manual Tasks': 'Implement automation for repetitive tasks to increase efficiency.',
    'Optimize Communication': 'Streamline communication channels to reduce delays and improve collaboration.',
    'Streamline Workflows': 'Reorganize and optimize your workflows to eliminate bottlenecks and redundancies.'
  };
  return descriptions[recommendation] || '';
};

export default ReportGenerator;