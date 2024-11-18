import React, { useState, useEffect } from 'react';
import { useAssessment } from '../../../contexts/AssessmentContext';

const ExitIntentModal: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { assessmentData } = useAssessment();

  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !isVisible) {
        setIsVisible(true);
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold mb-4">Wait! Don't Leave Yet</h2>
        <p className="text-gray-600 mb-6">
          You're just a few steps away from unlocking valuable insights about your business processes.
          Complete the assessment to receive your personalized optimization report.
        </p>
        <div className="flex flex-col space-y-4">
          <button
            onClick={() => setIsVisible(false)}
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
          >
            Continue Assessment
          </button>
          <button
            onClick={() => setIsVisible(false)}
            className="text-gray-600 hover:text-gray-800 transition-colors"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExitIntentModal;