import React, { useEffect, lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import AssessmentLayout from '../components/layout/AssessmentLayout';
import SEO from '../components/shared/SEO';
import { useAssessment } from '../contexts/AssessmentContext';
import { trackEvent } from '../components/features/assessment/utils/analytics';
import ErrorBoundary from '../components/shared/ErrorBoundary';
import LoadingStates from '../components/shared/LoadingStates';

// Lazy load components
const AssessmentLanding = lazy(() => import('../components/features/assessment/AssessmentLanding'));
const AssessmentFlow = lazy(() => import('../components/features/assessment/AssessmentFlow'));
const ReportGenerator = lazy(() => import('../components/features/assessment/ReportGenerator'));
const ScoreCards = lazy(() => import('../components/features/assessment/ScoreCards').then(m => ({ default: m.ScoreCards })));
const PreviewInsights = lazy(() => import('../components/features/assessment/PreviewInsights'));
const ExitIntentModal = lazy(() => import('../components/features/assessment/ExitIntentModal'));

const Assessment: React.FC = () => {
  const location = useLocation();
  const { assessmentData, setAssessmentData } = useAssessment();

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
      <SEO
        title="Process Automation Assessment"
        description="Discover your automation potential with our free assessment tool"
      />
      <AssessmentLayout>
        <Suspense fallback={<LoadingStates variant="spinner" size="lg" text="Loading assessment..." />}>
          <Routes>
            <Route index element={<AssessmentLanding />} />
            <Route path="questions/*" element={<AssessmentFlow />} />
            <Route path="report" element={<ReportGenerator />} />
            <Route path="score" element={<ScoreCards />} />
            <Route path="preview" element={<PreviewInsights />} />
            <Route path="*" element={<Navigate to="/assessment" replace />} />
          </Routes>
        </Suspense>
      </AssessmentLayout>
      <Suspense fallback={null}>
        <ExitIntentModal />
      </Suspense>
    </ErrorBoundary>
  );
};

export default Assessment;