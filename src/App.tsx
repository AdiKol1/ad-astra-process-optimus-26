import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import Assessment from './pages/Assessment';
import PrivacyPolicy from './pages/PrivacyPolicy';
import { ToastProvider } from '@/components/ui/toast'; // Assuming these are part of your providers
import { AssessmentProvider } from '@/contexts/AssessmentContext';
import { AuditFormProvider } from '@/contexts/AuditFormContext';

function App() {
  return (
    <Router>
      <ToastProvider>
        <AssessmentProvider>
          <AuditFormProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/assessment/*" element={<Assessment />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            </Routes>
          </AuditFormProvider>
        </AssessmentProvider>
      </ToastProvider>
    </Router>
  );
}

export default App;
