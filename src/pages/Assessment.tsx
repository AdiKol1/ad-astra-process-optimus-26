import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AssessmentLayout from '@/components/layout/AssessmentLayout';
import { QuestionnaireFlow } from '@/components/assessment/QuestionnaireFlow';
import { ROICalculator } from '@/components/assessment/ROICalculator';
import { ReportGenerator } from '@/components/assessment/ReportGenerator';

const Assessment = () => {
  return (
    <AssessmentLayout>
      <Routes>
        <Route path="questionnaire" element={<QuestionnaireFlow />} />
        <Route path="calculator" element={<ROICalculator />} />
        <Route path="report" element={<ReportGenerator />} />
        <Route path="*" element={<Navigate to="questionnaire" replace />} />
      </Routes>
    </AssessmentLayout>
  );
};

export default Assessment;