import React from 'react';

interface AssessmentLayoutProps {
  children: React.ReactNode;
}

const AssessmentLayout: React.FC<AssessmentLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </div>
  );
};

export default AssessmentLayout;