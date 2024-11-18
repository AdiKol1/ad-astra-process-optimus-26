import React, { ReactNode, useState } from 'react';
import { Button } from '../ui/button';
import ErrorBoundary from '../shared/ErrorBoundary';
import SEO from '../shared/SEO';

interface DashboardLayoutProps {
  children: ReactNode;
  title?: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, title }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: '📊' },
    { name: 'Assessments', href: '/dashboard/assessments', icon: '📝' },
    { name: 'Reports', href: '/dashboard/reports', icon: '📈' },
    { name: 'Settings', href: '/dashboard/settings', icon: '⚙️' },
  ];

  return (
    <ErrorBoundary>
      <SEO title={`Dashboard - ${title || 'Ad Astra Process Optimus'}`} />
      <div className="min-h-screen bg-gray-100">
        {/* Sidebar */}
        <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out lg:translate-x-0`}>
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="p-4 border-b">
              <h1 className="text-xl font-bold">Ad Astra</h1>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="flex items-center px-4 py-2 text-gray-600 rounded-md hover:bg-gray-50"
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.name}
                </a>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:pl-64">
          {/* Mobile Header */}
          <div className="sticky top-0 z-40 lg:hidden">
            <div className="flex items-center justify-between p-4 bg-white shadow-sm">
              <Button
                variant="ghost"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden"
              >
                ☰
              </Button>
              <h1 className="text-xl font-bold">Ad Astra</h1>
            </div>
          </div>

          {/* Content */}
          <main className="p-6">
            {title && (
              <h1 className="text-2xl font-bold text-gray-900 mb-6">{title}</h1>
            )}
            {children}
          </main>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default DashboardLayout;