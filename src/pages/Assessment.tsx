import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AssessmentProvider } from '@/contexts/AssessmentContext';
import { AuditFormProvider } from '@/contexts/AuditFormContext';
import AssessmentLayout from '@/components/layout/AssessmentLayout';
import AssessmentLanding from '@/components/features/assessment/AssessmentLanding';
import ProcessAssessment from '@/components/features/assessment/ProcessAssessment';
import MarketingAssessment from '@/components/features/assessment/MarketingAssessment';
import LeadCapture from '@/components/features/assessment/LeadCapture';
import AssessmentReport from '@/components/features/assessment/AssessmentReport';
import ErrorBoundary from '@/components/shared/ErrorBoundary';

const Assessment = () => {
  console.log('Assessment component rendering');
  
  return (
    <ErrorBoundary>
      <AssessmentProvider>
        <AuditFormProvider>
          <AssessmentLayout>
            <div className="min-h-screen bg-gradient-to-b from-space to-space-dark">
              <div className="container mx-auto px-4">
                <Routes>
                  <Route index element={<AssessmentLanding />} />
                  <Route path="process" element={<ProcessAssessment />} />
                  <Route path="marketing" element={<MarketingAssessment />} />
                  <Route path="capture" element={<LeadCapture />} />
                  <Route path="report" element={<AssessmentReport />} />
                </Routes>
              </div>
            </div>
          </AssessmentLayout>
        </AuditFormProvider>
      </AssessmentProvider>
    </ErrorBoundary>
  );
};

export default Assessment;