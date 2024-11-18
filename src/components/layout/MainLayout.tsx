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
      <div className="relative min-h-screen bg-background font-sans antialiased">
        {showNavigation && <Navigation />}
        <div className="flex-1">
          {children}
        </div>
        <footer className="border-t border-border bg-muted">
          <div className="container py-8 md:py-12">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <div>
                <h3 className="text-lg font-semibold mb-4">Ad Astra</h3>
                <p className="text-sm text-muted-foreground">
                  Transforming businesses through AI-powered process optimization.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Services</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="/services/crm-systems" className="text-sm text-muted-foreground hover:text-primary">
                      CRM Systems
                    </a>
                  </li>
                  <li>
                    <a href="/services/lead-generation" className="text-sm text-muted-foreground hover:text-primary">
                      Lead Generation
                    </a>
                  </li>
                  <li>
                    <a href="/services/content-generation" className="text-sm text-muted-foreground hover:text-primary">
                      Content Generation
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Company</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="/about" className="text-sm text-muted-foreground hover:text-primary">
                      About Us
                    </a>
                  </li>
                  <li>
                    <a href="/blog" className="text-sm text-muted-foreground hover:text-primary">
                      Blog
                    </a>
                  </li>
                  <li>
                    <a href="/contact" className="text-sm text-muted-foreground hover:text-primary">
                      Contact
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Connect</h3>
                <ul className="space-y-2">
                  <li>
                    <a 
                      href="https://www.linkedin.com/in/adi-kol-46078522/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-muted-foreground hover:text-primary"
                    >
                      LinkedIn
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-border">
              <p className="text-center text-sm text-muted-foreground">
                &copy; {new Date().getFullYear()} Ad Astra Process Optimus. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </ErrorBoundary>
  );
};

export default MainLayout;