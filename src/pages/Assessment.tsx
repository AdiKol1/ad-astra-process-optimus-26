import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import AssessmentLayout from '../components/layout/AssessmentLayout';
import AssessmentFlow from '../components/features/assessment/AssessmentFlow';
import { ReportGenerator } from '../components/features/assessment/ReportGenerator';
import { ScoreCards } from '../components/features/assessment/ScoreCards';
import SEO from '../components/shared/SEO';
import { useAssessment } from '../contexts/AssessmentContext';
import PreviewInsights from '../components/features/assessment/PreviewInsights';
import { trackEvent } from '../components/features/assessment/utils/analytics';
import ExitIntentModal from '../components/features/assessment/ExitIntentModal';
import ErrorBoundary from '../components/shared/ErrorBoundary';
import LoadingStates from '../components/shared/LoadingStates';

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
        
        {/* Modals */}
        <ExitIntentModal />
      </AssessmentLayout>
    </ErrorBoundary>
  );
};

export default Assessment;