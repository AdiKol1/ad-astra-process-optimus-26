import React, { Suspense, lazy } from 'react';
import { LoadingState } from '@/components/ui/LoadingState';
import { ErrorBoundary } from '@/components/error/ErrorBoundary';

// Lazy load components
const Contact = lazy(() => import('@/pages/Contact'));
const IndustryInsights = lazy(() => import('@/components/features/assessment/IndustryInsights').then(module => ({ default: module.IndustryInsights })));
const ScoreCards = lazy(() => import('@/components/features/assessment/ScoreCards').then(module => ({ default: module.ScoreCards })));
const AssessmentResults = lazy(() => import('@/components/features/assessment/AssessmentResults'));

// Route configuration with lazy loading
export const routes = [
  {
    path: '/contact',
    element: (
      <ErrorBoundary>
        <Suspense fallback={<LoadingState message="Loading contact page..." />}>
          <Contact />
        </Suspense>
      </ErrorBoundary>
    ),
  },
  {
    path: '/assessment/insights',
    element: (
      <ErrorBoundary>
        <Suspense fallback={<LoadingState message="Loading insights..." />}>
          <IndustryInsights />
        </Suspense>
      </ErrorBoundary>
    ),
  },
  {
    path: '/assessment/scores',
    element: (
      <ErrorBoundary>
        <Suspense fallback={<LoadingState message="Loading score cards..." />}>
          <ScoreCards />
        </Suspense>
      </ErrorBoundary>
    ),
  },
  {
    path: '/assessment/results',
    element: (
      <ErrorBoundary>
        <Suspense fallback={<LoadingState message="Loading assessment results..." />}>
          <AssessmentResults />
        </Suspense>
      </ErrorBoundary>
    ),
  },
];
