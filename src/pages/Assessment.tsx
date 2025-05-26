import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuditFormProvider } from '../contexts/AuditFormContext';
import AssessmentLayout from '../components/layout/AssessmentLayout';
import {
  AssessmentFlow,
  ProcessAssessment,
  MarketingAssessment,
  LeadCapture,
  AssessmentReport,
  AssessmentResults
} from '../components/features/assessment';
import ErrorBoundary from '../components/shared/ErrorBoundary';
import { Helmet } from 'react-helmet-async';
import { useAssessmentStore } from '@/contexts/assessment/store';
import { logger } from '../utils/logger';
import ScrollToTop from '@/components/shared/ScrollToTop';
import { useMobileDetection } from '@/hooks/useMobileDetection';

const Assessment: React.FC = () => {
  const { isMobile } = useMobileDetection();
  
  // Note: Removed route/state sync effects to prevent interference with AssessmentFlow
  // The AssessmentFlow component manages its own state and navigation

  return (
    <>
      <Helmet>
        <title>Process Assessment - Ad Astra Process Optimus</title>
        <meta name="description" content="Take our process assessment to identify automation opportunities" />
      </Helmet>
      <ErrorBoundary>
        <AuditFormProvider>
          <AssessmentLayout>
            <ScrollToTop />
            {/* Both mobile and desktop use AssessmentFlow for main assessment */}
            {isMobile ? (
              <Routes>
                <Route index element={<AssessmentFlow />} />
                <Route path="report" element={<AssessmentReport />} />
                <Route path="results" element={<AssessmentResults />} />
                {/* Redirect old routes to main flow */}
                <Route path="process" element={<AssessmentFlow />} />
                <Route path="marketing" element={<AssessmentFlow />} />
                <Route path="capture" element={<AssessmentFlow />} />
              </Routes>
            ) : (
              /* Desktop: Keep existing container layout */
              <div className="min-h-screen bg-gradient-to-b from-space to-space-dark">
                <div className="container mx-auto px-4">
                  <Routes>
                    <Route index element={<AssessmentFlow />} />
                    <Route path="report" element={<AssessmentReport />} />
                    <Route path="results" element={<AssessmentResults />} />
                    {/* Redirect old routes to main flow */}
                    <Route path="process" element={<AssessmentFlow />} />
                    <Route path="marketing" element={<AssessmentFlow />} />
                    <Route path="capture" element={<AssessmentFlow />} />
                  </Routes>
                </div>
              </div>
            )}
          </AssessmentLayout>
        </AuditFormProvider>
      </ErrorBoundary>
    </>
  );
};

export default Assessment;
