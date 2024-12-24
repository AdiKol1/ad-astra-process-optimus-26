import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuditFormProvider } from '@/contexts/AuditFormContext';
import AssessmentLayout from '@/components/layout/AssessmentLayout';
import {
  AssessmentFlow,
  ProcessAssessment,
  MarketingAssessment,
  LeadCapture,
  AssessmentReport
} from '@/components/features/assessment';
import ErrorBoundary from '@/components/shared/ErrorBoundary';

const Assessment = () => {
  return (
    <ErrorBoundary>
      <AuditFormProvider>
        <AssessmentLayout>
          <div className="min-h-screen bg-gradient-to-b from-space to-space-dark">
            <div className="container mx-auto px-4">
              <Routes>
                <Route index element={<AssessmentFlow />} />
                <Route path="process" element={<ProcessAssessment />} />
                <Route path="marketing" element={<MarketingAssessment />} />
                <Route path="capture" element={<LeadCapture />} />
                <Route path="report" element={<AssessmentReport />} />
              </Routes>
            </div>
          </div>
        </AssessmentLayout>
      </AuditFormProvider>
    </ErrorBoundary>
  );
};

export default Assessment;