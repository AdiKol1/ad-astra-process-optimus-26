import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AssessmentProvider } from '@/contexts/AssessmentContext';
import { AuditFormProvider } from '@/contexts/AuditFormContext';
import AssessmentLayout from '@/components/layout/AssessmentLayout';
import AssessmentFlow from '@/components/features/assessment/AssessmentFlow';
import ProcessAssessment from '@/components/features/assessment/ProcessAssessment';
import MarketingAssessment from '@/components/features/assessment/MarketingAssessment';
import LeadCapture from '@/components/features/assessment/LeadCapture';
import AssessmentReport from '@/components/features/assessment/AssessmentReport';
import ErrorBoundary from '@/components/shared/ErrorBoundary';

const Assessment = () => {
  return (
    <ErrorBoundary>
      <AssessmentProvider>
        <AuditFormProvider>
          <AssessmentLayout>
            <div className="min-h-screen bg-gradient-to-b from-space to-space-dark">
              <Routes>
                <Route index element={<AssessmentFlow />} />
                <Route path="process" element={<ProcessAssessment />} />
                <Route path="marketing" element={<MarketingAssessment />} />
                <Route path="capture" element={<LeadCapture />} />
                <Route path="report" element={<AssessmentReport />} />
                <Route path="*" element={<Navigate to="/assessment" replace />} />
              </Routes>
            </div>
          </AssessmentLayout>
        </AuditFormProvider>
      </AssessmentProvider>
    </ErrorBoundary>
  );
};

export default Assessment;