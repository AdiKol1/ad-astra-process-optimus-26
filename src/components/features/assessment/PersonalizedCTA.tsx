import React from 'react';
import { Button } from '@/components/ui/button';
import { useAssessment } from '@/contexts/AssessmentContext';
import { trackEvent } from '@/utils/analytics';

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
    <div className="mt-6">
      <Button 
        onClick={handleClick}
        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white"
      >
        Continue Assessment
      </Button>
      <p className="mt-2 text-sm text-gray-500 text-center">
        {assessmentData.currentStep < 3 ? 
          "You're making great progress!" : 
          "Almost there! Just a few more questions."}
      </p>
    </div>
  );
});

PersonalizedCTA.displayName = 'PersonalizedCTA';

export default PersonalizedCTA;