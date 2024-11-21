import React, { useEffect, Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import AssessmentLayout from '../components/layout/AssessmentLayout';
import SEO from '../components/shared/SEO';
import { useAssessment } from '../contexts/AssessmentContext';
import { trackEvent } from '../components/features/assessment/utils/analytics';
import ErrorBoundary from '../components/shared/ErrorBoundary';
import LoadingStates from '../components/shared/LoadingStates';

// Import components directly to avoid lazy loading issues
import AssessmentLanding from '../components/features/assessment/AssessmentLanding';
import ProcessAssessment from '../components/features/assessment/ProcessAssessment';
import ProcessDetails from '../components/features/assessment/ProcessDetails';
import MarketingAssessment from '../components/features/assessment/MarketingAssessment';
import Timeline from '../components/features/assessment/Timeline';
import LeadCapture from '../components/features/assessment/LeadCapture';
import ReportGenerator from '../components/features/assessment/ReportGenerator';
import ThankYou from '../components/features/assessment/ThankYou';

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
        <Routes>
          <Route index element={<AssessmentLanding />} />
          <Route path="processes" element={<ProcessAssessment />} />
          <Route path="process-details" element={<ProcessDetails />} />
          <Route path="marketing" element={<MarketingAssessment />} />
          <Route path="timeline" element={<Timeline />} />
          <Route path="capture" element={<LeadCapture />} />
          <Route path="report" element={<ReportGenerator />} />
          <Route path="thank-you" element={<ThankYou />} />
          <Route path="*" element={<Navigate to="/assessment" replace />} />
        </Routes>
      </AssessmentLayout>
    </ErrorBoundary>
  );
};

export default Assessment;