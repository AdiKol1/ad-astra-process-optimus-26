import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Suspense } from 'react';
import MainLayout from './components/layout/MainLayout';
import { AuditFormProvider } from './contexts/AuditFormContext';

// Import pages
import Index from './pages/Index';
import ServicesPage from './pages/Services';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import Assessment from './pages/Assessment';
import LeadGeneration from './pages/services/LeadGeneration';
import CRMSystems from './pages/services/CRMSystems';
import ContentGeneration from './pages/services/ContentGeneration';

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
  </div>
);

function App() {
  return (
    <HelmetProvider>
      <Router>
        <AuditFormProvider>
          <MainLayout>
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/services" element={<ServicesPage />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/assessment/*" element={<Assessment />} />
                <Route path="/services/lead-generation" element={<LeadGeneration />} />
                <Route path="/services/crm-systems" element={<CRMSystems />} />
                <Route path="/services/content-generation" element={<ContentGeneration />} />
              </Routes>
            </Suspense>
          </MainLayout>
        </AuditFormProvider>
      </Router>
    </HelmetProvider>
  );
}

export default App;
