import React, { ReactNode } from 'react';
import Navigation from './Navigation';
import ErrorBoundary from '../shared/ErrorBoundary';
import SEO from '../shared/SEO';

interface MainLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  showNavigation?: boolean;
}

const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  title,
  description,
  showNavigation = true,
}) => {
  return (
    <ErrorBoundary>
      <SEO title={title} description={description} />
      <div className="min-h-screen bg-white">
        {showNavigation && <Navigation />}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <footer className="bg-gray-50 border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center text-gray-500">
              &copy; {new Date().getFullYear()} Ad Astra Process Optimus. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </ErrorBoundary>
  );
};

export default MainLayout;