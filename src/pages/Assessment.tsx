import React, { useEffect, lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import AssessmentLayout from '../components/layout/AssessmentLayout';
import SEO from '../components/shared/SEO';
import { useAssessment } from '../contexts/AssessmentContext';
import { trackEvent } from '../components/features/assessment/utils/analytics';
import ErrorBoundary from '../components/shared/ErrorBoundary';
import LoadingStates from '../components/shared/LoadingStates';

// Lazy load components
const AssessmentFlow = lazy(() => import('../components/features/assessment/AssessmentFlow'));
const ReportGenerator = lazy(() => import('../components/features/assessment/ReportGenerator'));
const ScoreCards = lazy(() => import('../components/features/assessment/ScoreCards').then(m => ({ default: m.ScoreCards })));
const PreviewInsights = lazy(() => import('../components/features/assessment/PreviewInsights'));
const ExitIntentModal = lazy(() => import('../components/features/assessment/ExitIntentModal'));

const Assessment: React.FC = () => {
  const location = useLocation();
  const {
    assessmentData,
    setAssessmentData,
  } = useAssessment();

  // Initialize assessment data if not present
  useEffect(() => {
    if (!assessmentData) {
      const initialData = {
        responses: {},
        currentStep: 0,
        completed: false
      };
      setAssessmentData(initialData);
    }
  }, [assessmentData, setAssessmentData]);

  // Track session
  useEffect(() => {
    try {
      trackEvent('assessment_start', {
        path: location.pathname,
        referrer: document.referrer
      });
    } catch (error) {
      console.error('Analytics error:', error);
    }
  }, [location.pathname]);

  if (!assessmentData) {
    return <LoadingStates variant="spinner" size="lg" text="Loading assessment..." />;
  }

  return (
    <ErrorBoundary>
      <AssessmentLayout>
        <SEO 
          title="Process Optimization Assessment"
          description="Evaluate your business processes and discover optimization opportunities"
        />
        <Suspense fallback={<LoadingStates variant="spinner" size="lg" text="Loading..." />}>
          <Routes>
            <Route index element={<AssessmentFlow />} />
            <Route path="results" element={
              <ErrorBoundary>
                <div className="space-y-8">
                  <ScoreCards />
                  <ReportGenerator />
                </div>
              </ErrorBoundary>
            } />
            <Route path="preview" element={
              <ErrorBoundary>
                <PreviewInsights />
              </ErrorBoundary>
            } />
            <Route path="*" element={<Navigate to="/assessment" replace />} />
          </Routes>
          <ExitIntentModal />
        </Suspense>
      </AssessmentLayout>
    </ErrorBoundary>
  );
};

export default Assessment;