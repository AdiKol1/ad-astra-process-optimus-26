/**
 * Leads List Page Component
 * 
 * Displays paginated list of leads with filtering and search capabilities
 */

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLeadManagement } from '@/hooks/useLeads';
import { Search, Plus, Download, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';

export const LeadsListPage: React.FC = () => {
  const {
    leads,
    total,
    page,
    pageSize,
    isLoading,
    error,
    filters,
    pagination,
    sorting,
    refreshAll,
  } = useLeadManagement();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'contacted': return 'bg-yellow-100 text-yellow-800';
      case 'qualified': return 'bg-green-100 text-green-800';
      case 'closed_won': return 'bg-emerald-100 text-emerald-800';
      case 'closed_lost': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Leads</h1>
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-red-600">
              Error loading leads data. Please try again later.
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Leads</h1>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Lead
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
          <CardDescription>Find and manage your leads</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search leads by name, email, or company..."
                value={filters.searchTerm}
                onChange={(e) => filters.setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filters ({filters.activeFiltersCount})
            </Button>
            {filters.activeFiltersCount > 0 && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={filters.clearFilters}
              >
                Clear All
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{total}</div>
            <div className="text-sm text-gray-600">Total Leads</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {leads.filter(l => l.status === 'new').length}
            </div>
            <div className="text-sm text-gray-600">New Leads</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {leads.filter(l => l.status === 'qualified').length}
            </div>
            <div className="text-sm text-gray-600">Qualified</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {leads.filter(l => l.priority === 'high' || l.priority === 'urgent').length}
            </div>
            <div className="text-sm text-gray-600">High Priority</div>
          </CardContent>
        </Card>
      </div>

      {/* Leads Table */}
      <Card>
        <CardHeader>
          <CardTitle>Leads ({total})</CardTitle>
          <CardDescription>
            Showing {leads.length} of {total} leads
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-16 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : leads.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-500 mb-4">No leads found</div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add your first lead
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {leads.map((lead) => (
                <div
                  key={lead.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4">
                        <div>
                          <Link
                            to={`/dashboard/leads/${lead.id}`}
                            className="font-medium text-blue-600 hover:text-blue-700"
                          >
                            {lead.name}
                          </Link>
                          <div className="text-sm text-gray-600">{lead.email}</div>
                          {lead.company && (
                            <div className="text-sm text-gray-500">{lead.company}</div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-sm font-medium">Score: {lead.lead_score}</div>
                        <div className="text-xs text-gray-500">
                          {new Date(lead.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      
                      <div className="flex flex-col space-y-1">
                        <Badge className={getStatusColor(lead.status)}>
                          {lead.status.replace('_', ' ')}
                        </Badge>
                        <Badge className={getPriorityColor(lead.priority)}>
                          {lead.priority}
                        </Badge>
                      </div>
                      
                      <div className="text-sm text-gray-500">
                        {lead.source.replace('_', ' ')}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {total > pageSize && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, total)} of {total} leads
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => pagination.setPage(page - 1)}
                  disabled={page <= 1}
                >
                  Previous
                </Button>
                <div className="text-sm">
                  Page {page} of {Math.ceil(total / pageSize)}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => pagination.setPage(page + 1)}
                  disabled={page >= Math.ceil(total / pageSize)}
                >
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}; 