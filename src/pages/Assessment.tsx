import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AssessmentLayout from '../components/layout/AssessmentLayout';
import SEO from '../components/shared/SEO';
import { useAssessment } from '../contexts/AssessmentContext';
import ErrorBoundary from '../components/shared/ErrorBoundary';
import LoadingStates from '../components/shared/LoadingStates';

// Import components directly
import AssessmentLanding from '@/components/features/assessment/AssessmentLanding';
import ProcessAssessment from '@/components/features/assessment/ProcessAssessment';
import MarketingAssessment from '@/components/features/assessment/MarketingAssessment';
import LeadCapture from '@/components/features/assessment/LeadCapture';
import ReportGenerator from '@/components/features/assessment/ReportGenerator';
import ThankYou from '@/components/features/assessment/ThankYou';

const Assessment: React.FC = () => {
  const { assessmentData, setAssessmentData } = useAssessment();

  // Initialize assessment data if not present
  React.useEffect(() => {
    if (!assessmentData) {
      const initialData = {
        responses: {},
        currentStep: 0,
        totalSteps: 0
      };
      setAssessmentData(initialData);
    }
  }, [assessmentData, setAssessmentData]);

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
          <Route path="marketing" element={<MarketingAssessment />} />
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