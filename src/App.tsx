import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AssessmentProvider } from '@/contexts/assessment/AssessmentContext';
import { Toaster } from '@/components/ui/toaster';
import { ErrorBoundary } from '@/components/error/ErrorBoundary';
import { AssessmentFlow } from '@/components/features/assessment/core/AssessmentFlow';
import { AssessmentReport } from '@/components/features/assessment';

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <AssessmentProvider>
        <Router>
          <Routes>
            {/* Redirect root to assessment start */}
            <Route path="/" element={<Navigate to="/assessment/initial" replace />} />
            
            {/* Assessment flow routes */}
            <Route path="/assessment/:step" element={<AssessmentFlow />} />
            
            {/* Report route */}
            <Route path="/assessment/report" element={<AssessmentReport />} />
            
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/assessment/initial" replace />} />
          </Routes>
          <Toaster />
        </Router>
      </AssessmentProvider>
    </ErrorBoundary>
  );
};

export default App;
