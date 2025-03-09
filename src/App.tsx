import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UIProvider } from "@/contexts/ui/UIProvider";
import { FormProvider } from "@/contexts/assessment/FormProvider";
import { AssessmentProvider } from "@/contexts/assessment/AssessmentProvider";
import { ErrorBoundary } from '@/components/error/ErrorBoundary';
import { Header } from '@/components/layout/Header';
import { HelmetProvider } from 'react-helmet-async';
import { Suspense, lazy } from 'react';

// Lazy load components
const AssessmentFlow = lazy(() => import('@/components/features/assessment/core/AssessmentFlow/index'));
const Solutions = lazy(() => import('./pages/Solutions'));
const Features = lazy(() => import('./pages/Features'));
const Pricing = lazy(() => import('./pages/Pricing'));
const Contact = lazy(() => import('./pages/Contact'));
const Assessment = lazy(() => import('./pages/Assessment'));

const AppContent: React.FC = () => {
  console.log('Rendering AppContent');
  
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
        </Routes>
        <Toaster />
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
          <AssessmentProvider>
            <UIProvider>
              <FormProvider onSubmit={async (data) => {
                console.log('Form submitted with data:', data);
              }}>
                <AppContent />
              </FormProvider>
            </UIProvider>
          </AssessmentProvider>
        </BrowserRouter>
      </HelmetProvider>
    </ErrorBoundary>
  );
}
