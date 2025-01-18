import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Suspense, lazy } from 'react';
import MainLayout from './components/layout/MainLayout';
import { ChatProvider } from './contexts/ChatContext';
import { WebSocketProvider } from './components/chat/WebSocketProvider';
import ErrorBoundary from './components/shared/ErrorBoundary';
import { RootProvider } from './contexts/RootProvider';
import Assessment from './pages/Assessment';
import Login from './pages/Login';
import Index from './pages/Index';
import ServicesPage from './pages/Services';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Contact from './pages/Contact';
import LeadGeneration from './pages/services/LeadGeneration';
import CRMSystems from './pages/services/CRMSystems';
import ContentGeneration from './pages/services/ContentGeneration';
import NotFound from './pages/NotFound';

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
        <RootProvider>
          <ChatProvider>
            <WebSocketProvider>
              <Router>
                <SafeComponent>
                  <MainLayout>
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/services" element={<ServicesPage />} />
                      <Route path="/blog" element={<Blog />} />
                      <Route path="/blog/:slug" element={<BlogPost />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/assessment/*" element={<Assessment />} />
                      <Route path="/services/lead-generation" element={<LeadGeneration />} />
                      <Route path="/services/crm-systems" element={<CRMSystems />} />
                      <Route path="/services/content-generation" element={<ContentGeneration />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                    <Toaster />
                  </MainLayout>
                </SafeComponent>
              </Router>
            </WebSocketProvider>
          </ChatProvider>
        </RootProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
}

export default App;