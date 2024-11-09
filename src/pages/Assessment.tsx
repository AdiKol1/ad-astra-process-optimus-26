import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AssessmentLayout from '@/components/layout/AssessmentLayout';
import AssessmentFlow from '@/components/assessment/AssessmentFlow';
import Calculator from '@/components/assessment/Calculator';
import ReportGenerator from '@/components/assessment/ReportGenerator';

const Assessment = () => {
  return (
    <AssessmentLayout>
      <Routes>
        <Route path="/" element={<AssessmentFlow />} />
        <Route path="/calculator" element={<Calculator />} />
        <Route path="/report" element={<ReportGenerator />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AssessmentLayout>
  );
};

export default Assessment;