/**
 * React hooks for lead management
 * 
 * Provides state management and data fetching for leads dashboard components
 */

import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  leadService, 
  type LeadListOptions, 
  type LeadListFilters, 
  type CreateLeadData,
  type LeadStats 
} from '@/services/leads/leadService';
import type { Lead, LeadUpdate } from '@/integrations/supabase/types';
import { logger } from '@/utils/logger';
import { telemetry } from '@/utils/monitoring/telemetry';

/**
 * Hook for fetching and managing leads list
 */
export function useLeadsList(options: LeadListOptions = {}) {
  const {
    data,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['leads', options],
    queryFn: () => leadService.getLeads(options),
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    leads: data?.leads || [],
    total: data?.total || 0,
    page: data?.page || 1,
    pageSize: data?.pageSize || 50,
    isLoading,
    error,
    refetch,
  };
}

/**
 * Hook for fetching a single lead with activities
 */
export function useLead(leadId: string | null) {
  const leadQuery = useQuery({
    queryKey: ['lead', leadId],
    queryFn: () => leadId ? leadService.getLeadById(leadId) : null,
    enabled: !!leadId,
    staleTime: 60 * 1000, // 1 minute
  });

  const activitiesQuery = useQuery({
    queryKey: ['lead-activities', leadId],
    queryFn: () => leadId ? leadService.getLeadActivities(leadId) : [],
    enabled: !!leadId,
    staleTime: 30 * 1000, // 30 seconds
  });

  return {
    lead: leadQuery.data,
    activities: activitiesQuery.data || [],
    isLoading: leadQuery.isLoading || activitiesQuery.isLoading,
    error: leadQuery.error || activitiesQuery.error,
    refetch: () => {
      leadQuery.refetch();
      activitiesQuery.refetch();
    },
  };
}

/**
 * Hook for lead statistics and analytics
 */
export function useLeadStats(filters?: LeadListFilters) {
  return useQuery({
    queryKey: ['lead-stats', filters],
    queryFn: () => leadService.getLeadStats(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook for creating leads
 */
export function useCreateLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateLeadData) => leadService.createLead(data),
    onSuccess: (lead: Lead) => {
      // Invalidate and refetch leads list
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['lead-stats'] });
      
      // Add the new lead to the cache
      queryClient.setQueryData(['lead', lead.id], lead);
      
      telemetry.track('lead_created_via_hook', { leadId: lead.id });
      logger.info('Lead created successfully via hook', { leadId: lead.id });
    },
    onError: (error: Error) => {
      logger.error('Failed to create lead via hook', { error });
    },
  });
}

/**
 * Hook for updating leads
 */
export function useUpdateLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: LeadUpdate }) => 
      leadService.updateLead(id, updates),
    onSuccess: (lead: Lead) => {
      // Update the lead in cache
      queryClient.setQueryData(['lead', lead.id], lead);
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['lead-stats'] });
      queryClient.invalidateQueries({ queryKey: ['lead-activities', lead.id] });
      
      telemetry.track('lead_updated_via_hook', { leadId: lead.id });
    },
    onError: (error: Error, variables: { id: string; updates: LeadUpdate }) => {
      logger.error('Failed to update lead via hook', { error, leadId: variables.id });
    },
  });
}

/**
 * Hook for updating lead status
 */
export function useUpdateLeadStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status, notes }: { id: string; status: string; notes?: string }) => 
      leadService.updateLeadStatus(id, status, notes),
    onSuccess: (lead: Lead) => {
      // Update the lead in cache
      queryClient.setQueryData(['lead', lead.id], lead);
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['lead-stats'] });
      queryClient.invalidateQueries({ queryKey: ['lead-activities', lead.id] });
      
      telemetry.track('lead_status_updated_via_hook', { 
        leadId: lead.id, 
        newStatus: lead.status 
      });
    },
    onError: (error: Error, variables: { id: string; status: string; notes?: string }) => {
      logger.error('Failed to update lead status via hook', { 
        error, 
        leadId: variables.id,
        status: variables.status
      });
    },
  });
}

/**
 * Hook for deleting leads
 */
export function useDeleteLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => leadService.deleteLead(id),
    onSuccess: (_result: void, leadId: string) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: ['lead', leadId] });
      queryClient.removeQueries({ queryKey: ['lead-activities', leadId] });
      
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['lead-stats'] });
      
      telemetry.track('lead_deleted_via_hook', { leadId });
    },
    onError: (error: Error, leadId: string) => {
      logger.error('Failed to delete lead via hook', { error, leadId });
    },
  });
}

/**
 * Hook for exporting leads
 */
export function useExportLeads() {
  return useMutation({
    mutationFn: (filters?: LeadListFilters) => leadService.exportLeads(filters),
    onSuccess: (csvData) => {
      // Download the CSV file
      const blob = new Blob([csvData], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `leads-export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      telemetry.track('leads_exported', { 
        timestamp: new Date().toISOString(),
        recordCount: csvData.split('\n').length - 1 // Subtract header row
      });
    },
    onError: (error: Error) => {
      logger.error('Failed to export leads', { error });
    },
  });
}

/**
 * Hook for managing lead filters and search state
 */
export function useLeadFilters() {
  const [filters, setFilters] = useState<LeadListFilters>({});
  const [searchTerm, setSearchTerm] = useState('');
  
  const updateFilter = useCallback((key: keyof LeadListFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
    setSearchTerm('');
  }, []);

  const activeFiltersCount = Object.keys(filters).filter(key => {
    const value = filters[key as keyof LeadListFilters];
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'object' && value !== null) return Object.keys(value).length > 0;
    return value !== undefined && value !== null && value !== '';
  }).length;

  return {
    filters: {
      ...filters,
      ...(searchTerm ? { search: searchTerm } : {})
    },
    searchTerm,
    setSearchTerm,
    updateFilter,
    clearFilters,
    activeFiltersCount,
  };
}

/**
 * Hook for managing pagination state
 */
export function usePagination(initialPageSize = 50) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const resetPagination = useCallback(() => {
    setPage(1);
  }, []);

  const goToPage = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const changePageSize = useCallback((newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(1); // Reset to first page when changing page size
  }, []);

  return {
    page,
    pageSize,
    setPage: goToPage,
    setPageSize: changePageSize,
    resetPagination,
  };
}

/**
 * Hook for managing sorting state
 */
export function useLeadSorting() {
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const updateSort = useCallback((field: string) => {
    if (field === sortBy) {
      // Toggle order if same field
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // New field, default to descending
      setSortBy(field);
      setSortOrder('desc');
    }
  }, [sortBy, sortOrder]);

  return {
    sortBy,
    sortOrder,
    updateSort,
  };
}

/**
 * Combined hook that manages all lead list state
 */
export function useLeadManagement() {
  const filters = useLeadFilters();
  const pagination = usePagination();
  const sorting = useLeadSorting();

  const listOptions: LeadListOptions = {
    page: pagination.page,
    pageSize: pagination.pageSize,
    sortBy: sorting.sortBy,
    sortOrder: sorting.sortOrder,
    filters: filters.filters,
  };

  const leadsQuery = useLeadsList(listOptions);
  const statsQuery = useLeadStats(filters.filters);

  // Reset pagination when filters change
  useEffect(() => {
    pagination.resetPagination();
  }, [filters.filters, pagination.resetPagination]);

  return {
    // Data
    ...leadsQuery,
    stats: statsQuery.data,
    statsLoading: statsQuery.isLoading,
    statsError: statsQuery.error,

    // State management
    filters,
    pagination,
    sorting,

    // Combined state
    listOptions,
    
    // Refresh everything
    refreshAll: () => {
      leadsQuery.refetch();
      statsQuery.refetch();
    },
  };
} 