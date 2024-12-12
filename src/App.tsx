import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Suspense, lazy } from 'react';
import MainLayout from './components/layout/MainLayout';
import { AssessmentProvider } from './contexts/AssessmentContext';
import { ProcessProvider } from './contexts/assessment/ProcessContext';
import { MarketingProvider } from './contexts/assessment/MarketingContext';
import { Toaster } from './components/ui/toaster';
import ErrorBoundary from './components/shared/ErrorBoundary';
import Assessment from './pages/Assessment';

// Lazy load other pages
const Index = lazy(() => import('./pages/Index'));
const ServicesPage = lazy(() => import('./pages/Services'));
const Blog = lazy(() => import('./pages/Blog'));
const Contact = lazy(() => import('./pages/Contact'));
const LeadGeneration = lazy(() => import('./pages/services/LeadGeneration'));
const CRMSystems = lazy(() => import('./pages/services/CRMSystems'));
const ContentGeneration = lazy(() => import('./pages/services/ContentGeneration'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Loading component with error handling
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

const SafeComponent: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ErrorBoundary>
    <Suspense fallback={<LoadingSpinner />}>
      {children}
    </Suspense>
  </ErrorBoundary>
);

function App() {
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <Router>
          <ProcessProvider>
            <MarketingProvider>
              <AssessmentProvider>
                <div className="min-h-screen bg-background font-sans antialiased">
                  <MainLayout>
                    <SafeComponent>
                      <Routes>
                        <Route path="/" element={<Index />} />
                        <Route path="/services" element={<ServicesPage />} />
                        <Route path="/blog" element={<Blog />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/assessment/*" element={<Assessment />} />
                        <Route path="/services/lead-generation" element={<LeadGeneration />} />
                        <Route path="/services/crm-systems" element={<CRMSystems />} />
                        <Route path="/services/content-generation" element={<ContentGeneration />} />
                        <Route path="/404" element={<NotFound />} />
                        <Route path="*" element={<Navigate to="/404" replace />} />
                      </Routes>
                    </SafeComponent>
                  </MainLayout>
                  <Toaster />
                </div>
              </AssessmentProvider>
            </MarketingProvider>
          </ProcessProvider>
        </Router>
      </HelmetProvider>
    </ErrorBoundary>
  );
}

export default App;