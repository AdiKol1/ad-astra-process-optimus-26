import React from 'react';
import { Button } from '@/components/ui/button';
import { useAssessment } from './AssessmentContext';
import { trackEvent } from './utils/analytics';

interface PersonalizedCTAProps {
  onAction: () => void;
}

const PersonalizedCTA: React.FC<PersonalizedCTAProps> = React.memo(({ onAction }) => {
  const { assessmentData } = useAssessment();

  const handleClick = () => {
    trackEvent('cta_clicked', {
      section: 'assessment',
      progress: assessmentData?.currentStep || 0
    });
    onAction();
  };

  if (!assessmentData) return null;

  return (
    <div className="mt-6" data-testid="personalized-cta">
      <Button 
        onClick={handleClick}
        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white"
      >
        Continue Assessment
      </Button>
      <p className="mt-2 text-sm text-gray-500 text-center">
        {assessmentData.currentStep > 75 
          ? "You're almost done!" 
          : assessmentData.currentStep > 50 
            ? "Almost there! Just a few more questions." 
            : "You're making great progress!"}
      </p>
    </div>
  );
});

PersonalizedCTA.displayName = 'PersonalizedCTA';

export default PersonalizedCTA;