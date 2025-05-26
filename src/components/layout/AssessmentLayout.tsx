import React from 'react';
import { useMobileDetection } from '@/hooks/useMobileDetection';

interface AssessmentLayoutProps {
  children: React.ReactNode;
}

const AssessmentLayout: React.FC<AssessmentLayoutProps> = ({ children }) => {
  const { isMobile } = useMobileDetection();

  // Mobile: No containers, no padding - let MobileProgressiveForm handle everything
  if (isMobile) {
    return (
      <div className="min-h-screen">
        {children}
      </div>
    );
  }

  // Desktop: Keep existing layout
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </div>
  );
};

export default AssessmentLayout;