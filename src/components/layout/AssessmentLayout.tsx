import React from 'react';
import { cn } from "@/lib/utils";

interface AssessmentLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const AssessmentLayout = ({ children, className }: AssessmentLayoutProps) => {
  return (
    <div className={cn("min-h-screen bg-space", className)}>
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </div>
    </div>
  );
};

export default AssessmentLayout;