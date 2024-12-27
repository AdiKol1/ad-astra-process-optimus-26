import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Suspense, lazy, useEffect, useState } from 'react';
import MainLayout from './components/layout/MainLayout';
import { AssessmentProvider } from './contexts/AssessmentContext';
import { Toaster } from './components/ui/toaster';
import ErrorBoundary from './components/shared/ErrorBoundary';
import Assessment from './pages/Assessment';
import { VoiceChat } from './components/VoiceChat';
import { supabase } from './integrations/supabase/client';
import Login from './pages/Login';

// Add logging for lazy loading
const Index = lazy(() => {
  console.log('Loading Index page');
  return import('./pages/Index');
});
const ServicesPage = lazy(() => import('./pages/Services'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const Contact = lazy(() => import('./pages/Contact'));
const LeadGeneration = lazy(() => import('./pages/services/LeadGeneration'));
const CRMSystems = lazy(() => import('./pages/services/CRMSystems'));
const ContentGeneration = lazy(() => import('./pages/services/ContentGeneration'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Loading component with error handling
const LoadingSpinner = () => {
  console.log('LoadingSpinner rendered');
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );
};

const SafeComponent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  console.log('SafeComponent rendered');
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingSpinner />}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
};

// Protected Route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (isAuthenticated === null) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

function App() {
  console.log('App component rendering');
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <Router>
          <AssessmentProvider>
            <div className="min-h-screen bg-background font-sans antialiased">
              <MainLayout>
                <SafeComponent>
                  <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/" element={<Index />} />
                    <Route path="/services" element={<ServicesPage />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/blog/:slug" element={<BlogPost />} />
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
              <VoiceChat />
              <Toaster />
            </div>
          </AssessmentProvider>
        </Router>
      </HelmetProvider>
    </ErrorBoundary>
  );
}

export default App;