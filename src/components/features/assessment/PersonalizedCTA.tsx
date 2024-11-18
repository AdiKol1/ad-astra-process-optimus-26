import React, { useMemo } from 'react';
import { useAssessment } from '@/contexts/AssessmentContext';

interface PersonalizedCTAProps {
  onAction: (action: string) => void;
}

const PersonalizedCTA: React.FC<PersonalizedCTAProps> = React.memo(({ onAction }) => {
  const { assessmentData } = useAssessment();

  const ctaData = useMemo(() => {
    if (!assessmentData?.responses) return null;

    const processComplexity = assessmentData.responses.processComplexity || 'Medium';
    const manualProcesses = assessmentData.responses.manualProcesses || [];
    const urgency = processComplexity === 'High' || manualProcesses.length > 2;

    return {
      title: urgency 
        ? 'Urgent Process Optimization Needed' 
        : 'Unlock Your Process Optimization Potential',
      description: urgency
        ? 'Your assessment indicates critical areas for immediate improvement'
        : 'Discover how to enhance your business processes',
      buttonText: urgency
        ? 'Schedule Urgent Consultation'
        : 'View Detailed Insights',
      action: urgency ? 'schedule_urgent' : 'view_roadmap'
    };
  }, [assessmentData?.responses]);

  if (!ctaData) return null;

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 my-4">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        {ctaData.title}
      </h3>
      <div className="space-y-4">
        <p className="text-gray-600">
          {ctaData.description}
        </p>
        <button
          className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          onClick={() => onAction(ctaData.action)}
          aria-label={ctaData.buttonText}
        >
          {ctaData.buttonText}
        </button>
      </div>
    </div>
  );
});

PersonalizedCTA.displayName = 'PersonalizedCTA';

export default PersonalizedCTA;