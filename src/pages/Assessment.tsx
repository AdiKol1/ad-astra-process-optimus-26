import React, { useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
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
import { useAssessmentStore } from '../stores/assessment';
import { logger } from '../utils/logger';

const Assessment: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentStep, setStep } = useAssessmentStore();

  // Sync route with state
  useEffect(() => {
    const path = location.pathname.split('/').pop() || '';
    if (path && path !== currentStep) {
      logger.info('Syncing route with state', { path, currentStep });
      setStep(path as any);
    }
  }, [location.pathname, currentStep, setStep]);

  // Sync state with route
  useEffect(() => {
    if (currentStep && !location.pathname.includes(currentStep)) {
      logger.info('Syncing state with route', { currentStep, path: location.pathname });
      navigate(currentStep === 'initial' ? '' : currentStep, { replace: true });
    }
  }, [currentStep, navigate, location.pathname]);

  return (
    <>
      <Helmet>
        <title>Process Assessment - Ad Astra Process Optimus</title>
        <meta name="description" content="Take our process assessment to identify automation opportunities" />
      </Helmet>
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
                  <Route path="results" element={<AssessmentResults />} />
                </Routes>
              </div>
            </div>
          </AssessmentLayout>
        </AuditFormProvider>
      </ErrorBoundary>
    </>
  );
};

export default Assessment;
