import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Suspense, lazy } from 'react';
import MainLayout from './components/layout/MainLayout';
import { AssessmentProvider } from './contexts/AssessmentContext';
import { Toaster } from './components/ui/toaster';
import ErrorBoundary from './components/shared/ErrorBoundary';

// Lazy load pages
const Index = lazy(() => import('./pages/Index'));
const ServicesPage = lazy(() => import('./pages/Services'));
const Blog = lazy(() => import('./pages/Blog'));
const Contact = lazy(() => import('./pages/Contact'));
const Assessment = lazy(() => import('./pages/Assessment'));
const LeadGeneration = lazy(() => import('./pages/services/LeadGeneration'));
const CRMSystems = lazy(() => import('./pages/services/CRMSystems'));
const ContentGeneration = lazy(() => import('./pages/services/ContentGeneration'));

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <Router>
          <AssessmentProvider>
            <div className="min-h-screen bg-background font-sans antialiased">
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
              <Toaster />
            </div>
          </AssessmentProvider>
        </Router>
      </HelmetProvider>
    </ErrorBoundary>
  );
}

export default App;
