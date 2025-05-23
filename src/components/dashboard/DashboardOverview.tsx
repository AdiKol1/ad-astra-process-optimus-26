/**
 * Dashboard Overview Component
 * 
 * Shows key metrics and summary statistics for leads management
 */

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLeadStats } from '@/hooks/useLeads';
import { Users, TrendingUp, DollarSign, Target } from 'lucide-react';

export const DashboardOverview: React.FC = () => {
  const { data: stats, isLoading, error } = useLeadStats();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-red-600">
              Error loading dashboard data. Please try again later.
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total || 0}</div>
            <p className="text-xs text-muted-foreground">
              Active prospects in pipeline
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.conversionRate?.toFixed(1) || 0}%</div>
            <p className="text-xs text-muted-foreground">
              Leads converted to customers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pipeline Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stats?.totalValue?.toLocaleString() || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Total estimated deal value
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Lead Score</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.averageScore?.toFixed(0) || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Out of 100 possible points
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and detailed views */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Leads by Status</CardTitle>
            <CardDescription>Distribution of leads across different stages</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats?.byStatus && Object.entries(stats.byStatus).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="text-sm font-medium capitalize">
                      {status.replace('_', ' ')}
                    </span>
                  </div>
                  <span className="text-sm text-gray-600">{count}</span>
                </div>
              )) || <div className="text-sm text-gray-500">No data available</div>}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Leads by Source</CardTitle>
            <CardDescription>Where your leads are coming from</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats?.bySource && Object.entries(stats.bySource).map(([source, count]) => (
                <div key={source} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-sm font-medium capitalize">
                      {source.replace('_', ' ')}
                    </span>
                  </div>
                  <span className="text-sm text-gray-600">{count}</span>
                </div>
              )) || <div className="text-sm text-gray-500">No data available</div>}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-4 border rounded-lg hover:bg-gray-50 transition-colors text-left">
              <div className="font-medium">View All Leads</div>
              <div className="text-sm text-gray-500">Manage your lead pipeline</div>
            </button>
            <button className="p-4 border rounded-lg hover:bg-gray-50 transition-colors text-left">
              <div className="font-medium">Export Data</div>
              <div className="text-sm text-gray-500">Download leads to CSV</div>
            </button>
            <button className="p-4 border rounded-lg hover:bg-gray-50 transition-colors text-left">
              <div className="font-medium">Analytics</div>
              <div className="text-sm text-gray-500">View detailed reports</div>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 