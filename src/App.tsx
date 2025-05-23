import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UIProvider } from "@/contexts/ui/UIProvider";
import { FormProvider } from "@/contexts/assessment/FormProvider";
import { AssessmentProvider } from "@/contexts/assessment/AssessmentProvider";
import { AuthProvider } from "@/contexts/auth/AuthContext";
// import { ChatProvider } from "@/contexts/ChatContext";
import { ErrorBoundary } from '@/components/error/ErrorBoundary';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Header } from '@/components/layout/Header';
import { HelmetProvider } from 'react-helmet-async';
import { Suspense, lazy, useEffect } from 'react';
import ScrollToTop from '@/components/shared/ScrollToTop';
import { logger } from '@/utils/logger';
import { useLocation } from 'react-router-dom';

// Lazy load components
const AssessmentFlow = lazy(() => import('@/components/features/assessment/core/AssessmentFlow/index'));
const Solutions = lazy(() => import('./pages/Solutions'));
const Features = lazy(() => import('./pages/Features'));
const Pricing = lazy(() => import('./pages/Pricing'));
const Contact = lazy(() => import('./pages/Contact'));
const Assessment = lazy(() => import('./pages/Assessment'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const UnifiedLogin = lazy(() => import('./pages/UnifiedLogin'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const SimpleChatBot = lazy(() => import('./components/SimpleChatBot'));

const AppContent: React.FC = () => {
  console.log('Rendering AppContent');
  const location = useLocation();

  // Track page views for analytics
  useEffect(() => {
    const pageName = location.pathname === '/' ? 'home' : location.pathname.replace('/', '');
    logger.pageView(pageName, {
      path: location.pathname,
      search: location.search,
      timestamp: new Date().toISOString()
    });
  }, [location]);
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={
            <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
              <AssessmentFlow />
            </Suspense>
          } />
          <Route path="/solutions" element={
            <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
              <Solutions />
            </Suspense>
          } />
          <Route path="/features" element={
            <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
              <Features />
            </Suspense>
          } />
          <Route path="/pricing" element={
            <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
              <Pricing />
            </Suspense>
          } />
          <Route path="/contact" element={
            <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
              <Contact />
            </Suspense>
          } />
          <Route path="/assessment" element={
            <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
              <Assessment />
            </Suspense>
          } />
          <Route path="/login" element={
            <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
              <UnifiedLogin />
            </Suspense>
          } />
          <Route path="/dashboard/*" element={
            <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            </Suspense>
          } />
          <Route path="/admin/login" element={
            <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
              <AdminLogin />
            </Suspense>
          } />
          <Route path="/admin/forgot-password" element={
            <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
              <ForgotPassword />
            </Suspense>
          } />
          <Route path="/admin/reset-password" element={
            <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
              <ResetPassword />
            </Suspense>
          } />
        </Routes>
        <Toaster />
        
        {/* SimpleChatBot - available on all pages */}
        <Suspense fallback={null}>
          <SimpleChatBot />
        </Suspense>
      </main>
    </div>
  );
};

export default function App() {
  console.log('Rendering App');

  return (
    <ErrorBoundary fallback={<div>Something went wrong. Please refresh the page.</div>}>
      <HelmetProvider>
        <BrowserRouter>
          <ScrollToTop />
          <AssessmentProvider>
            <UIProvider>
              <FormProvider onSubmit={async (data) => {
                console.log('Form submitted with data:', data);
              }}>
                <AuthProvider>
                  <AppContent />
                </AuthProvider>
              </FormProvider>
            </UIProvider>
          </AssessmentProvider>
        </BrowserRouter>
      </HelmetProvider>
    </ErrorBoundary>
  );
}
