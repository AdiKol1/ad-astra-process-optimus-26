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

// Lazy load components with explicit error handling
const AssessmentFlow = lazy(() => 
  import('@/components/features/assessment/core/AssessmentFlow/index')
    .catch(error => {
      console.error('Failed to load AssessmentFlow:', error);
      // Return a minimal module to avoid breaking the app
      return { default: () => <div>Error loading assessment. Please try again.</div> };
    })
);
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
            <Suspense fallback={
              <div className="flex flex-col items-center justify-center h-screen">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-gray-700">Loading assessment flow...</p>
                <p className="text-sm text-gray-500 mt-2">If this takes too long, please <a href="/assessment" className="text-blue-500 hover:underline">click here</a>.</p>
              </div>
            }>
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
