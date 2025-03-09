import React, { Suspense, lazy } from 'react';
import { LoadingSpinner } from './components/shared/LoadingSpinner';
import ErrorBoundary from './components/shared/ErrorBoundary';
import Assessment from './pages/Assessment'; // Import Assessment component
import Index from './pages/index'; // Import Index component (corrected case)

// Lazy load components
const Contact = lazy(() => import('./pages/Contact'));
const Solutions = lazy(() => import('./pages/Solutions'));
const Features = lazy(() => import('./pages/Features'));
const IndustryInsights = lazy(() => import('./components/features/assessment/IndustryInsights').then(module => ({ default: module.IndustryInsights })));
const ScoreCards = lazy(() => import('./components/features/assessment/score-cards/EfficiencyCard').then(module => ({ default: module.EfficiencyCard })));
const AssessmentResults = lazy(() => import('./components/features/assessment/AssessmentResults').then(module => ({ default: module.AssessmentResults })));

// Route configuration with lazy loading
export const routes = [
  {
    path: '/',
    element: (
      <ErrorBoundary>
        <Suspense fallback={<LoadingSpinner />}>
          <Index />
        </Suspense>
      </ErrorBoundary>
    ),
  },
  {
    path: '/solutions',
    element: (
      <ErrorBoundary>
        <Suspense fallback={<LoadingSpinner />}>
          <Solutions />
        </Suspense>
      </ErrorBoundary>
    ),
  },
  {
    path: '/features',
    element: (
      <ErrorBoundary>
        <Suspense fallback={<LoadingSpinner />}>
          <Features />
        </Suspense>
      </ErrorBoundary>
    ),
  },
  {
    path: '/contact',
    element: (
      <ErrorBoundary>
        <Suspense fallback={<LoadingSpinner />}>
          <Contact />
        </Suspense>
      </ErrorBoundary>
    ),
  },
  {
    path: '/assessment/insights',
    element: (
      <ErrorBoundary>
        <Suspense fallback={<LoadingSpinner />}>
          <IndustryInsights />
        </Suspense>
      </ErrorBoundary>
    ),
  },
  {
    path: '/assessment/scores',
    element: (
      <ErrorBoundary>
        <Suspense fallback={<LoadingSpinner />}>
          <ScoreCards title="Efficiency Score" value={75} />
        </Suspense>
      </ErrorBoundary>
    ),
  },
  {
    path: '/assessment/results',
    element: (
      <ErrorBoundary>
        <Suspense fallback={<LoadingSpinner />}>
          <AssessmentResults />
        </Suspense>
      </ErrorBoundary>
    ),
  },
  {
    path: '/assessment',
    element: (
      <ErrorBoundary>
        <Suspense fallback={<LoadingSpinner />}>
          <Assessment />
        </Suspense>
      </ErrorBoundary>
    ),
  },
];
