import React from 'react';
import { AssessmentProvider } from '../features/assessment/AssessmentContext';

interface AssessmentLayoutProps {
  children: React.ReactNode;
}

const AssessmentLayout: React.FC<AssessmentLayoutProps> = ({ children }) => {
  return (
    <AssessmentProvider>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </div>
    </AssessmentProvider>
  );
};

export default AssessmentLayout;