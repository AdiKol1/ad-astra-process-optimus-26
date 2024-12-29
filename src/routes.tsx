import React, { Suspense, lazy } from 'react';
import LoadingSpinner from './components/shared/LoadingSpinner';
import ErrorBoundary from './components/shared/ErrorBoundary';

// Lazy load components
const Contact = lazy(() => import('./pages/Contact'));
const IndustryInsights = lazy(() => import('./components/features/assessment/IndustryInsights').then(module => ({ default: module.IndustryInsights })));
const ScoreCards = lazy(() => import('./components/features/assessment/ScoreCards').then(module => ({ default: module.ScoreCards })));
const AssessmentResults = lazy(() => import('./components/features/assessment/AssessmentResults'));

// Route configuration with lazy loading
export const routes = [
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
          <ScoreCards />
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
];
