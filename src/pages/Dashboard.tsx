/**
 * Main Dashboard Page
 * 
 * Entry point for the leads management system with overview stats and navigation
 */

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { DashboardOverview } from '@/components/dashboard/DashboardOverview';
import { LeadsListPage } from '@/components/dashboard/leads/LeadsListPage';
import { LeadDetailPage } from '@/components/dashboard/leads/LeadDetailPage';
import { UserManagement } from '@/pages/UserManagement';
import RoleManagement from '@/pages/RoleManagement';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { logger } from '@/utils/logger';

// Create a query client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000, // 30 seconds
      gcTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        logger.error('Query failed', { failureCount, error });
        return failureCount < 3;
      },
    },
    mutations: {
      retry: (failureCount, error) => {
        logger.error('Mutation failed', { failureCount, error });
        return failureCount < 2;
      },
    },
  },
});

export const Dashboard: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <DashboardLayout>
        <Routes>
          <Route index element={<DashboardOverview />} />
          <Route path="leads" element={<LeadsListPage />} />
          <Route path="leads/:leadId" element={<LeadDetailPage />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="roles" element={<RoleManagement />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </DashboardLayout>
    </QueryClientProvider>
  );
};

export default Dashboard; 