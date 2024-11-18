import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AssessmentLayout from '../components/layout/AssessmentLayout';
import AssessmentFlow from '../components/features/assessment/AssessmentFlow';
import Calculator from '../components/features/assessment/Calculator';
import ReportGenerator from '../components/features/assessment/ReportGenerator';
import SEO from '../components/shared/SEO';

const Assessment = () => {
  return (
    <>
      <SEO 
        title="Assessment - Ad Astra Process Optimus"
        description="Complete your process optimization assessment"
      />
      <AssessmentLayout>
        <Routes>
          <Route path="/" element={<AssessmentFlow />} />
          <Route path="/calculator" element={<Calculator />} />
          <Route path="/report" element={<ReportGenerator />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AssessmentLayout>
    </>
  );
};

export default Assessment;