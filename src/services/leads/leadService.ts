/**
 * Lead Service - Core business logic for lead management
 * 
 * This service handles:
 * - Lead CRUD operations
 * - Lead scoring and qualification
 * - Activity tracking
 * - Integration with assessment system
 * - Data validation and transformation
 */

import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';
import { telemetry } from '@/utils/monitoring/telemetry';
import type { 
  Lead, 
  LeadInsert, 
  LeadUpdate, 
  LeadActivity, 
  LeadActivityInsert,
  LeadScoringRule 
} from '@/integrations/supabase/types';

export interface LeadListFilters {
  status?: string[];
  priority?: string[];
  source?: string[];
  assignedTo?: string;
  search?: string;
  dateRange?: {
    from: string;
    to: string;
  };
  tags?: string[];
  leadScore?: {
    min: number;
    max: number;
  };
}

export interface LeadListOptions {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filters?: LeadListFilters;
}

export interface LeadStats {
  total: number;
  byStatus: Record<string, number>;
  bySource: Record<string, number>;
  byPriority: Record<string, number>;
  conversionRate: number;
  averageScore: number;
  totalValue: number;
}

export interface CreateLeadData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  industry?: string;
  source: string;
  sourceDetails?: Record<string, any>;
  utmData?: {
    source?: string;
    medium?: string;
    campaign?: string;
    content?: string;
    term?: string;
  };
  assessmentData?: {
    id: string;
    completed: boolean;
    score?: number;
    responses?: Record<string, any>;
  };
  businessContext?: {
    companySize?: string;
    processVolume?: string;
    timeline?: string;
    annualRevenue?: string;
    currentTools?: string[];
    painPoints?: string[];
  };
}

export class LeadService {
  /**
   * Create a new lead with automatic scoring
   */
  async createLead(data: CreateLeadData): Promise<Lead> {
    try {
      logger.info('Creating new lead', { email: data.email, source: data.source });
      
      // Check if lead already exists
      const existingLead = await this.findLeadByEmail(data.email);
      if (existingLead) {
        logger.warn('Lead already exists, updating instead', { email: data.email });
        return this.updateLead(existingLead.id, this.buildUpdateFromCreateData(data));
      }

      // Prepare lead data
      const leadData: LeadInsert = {
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        company: data.company || null,
        industry: data.industry || null,
        source: data.source,
        source_details: data.sourceDetails || {},
        utm_source: data.utmData?.source || null,
        utm_medium: data.utmData?.medium || null,
        utm_campaign: data.utmData?.campaign || null,
        utm_content: data.utmData?.content || null,
        utm_term: data.utmData?.term || null,
        assessment_id: data.assessmentData?.id || null,
        assessment_completed: data.assessmentData?.completed || false,
        assessment_score: data.assessmentData?.score || null,
        assessment_data: data.assessmentData?.responses || {},
        company_size: data.businessContext?.companySize || null,
        process_volume: data.businessContext?.processVolume || null,
        timeline_expectation: data.businessContext?.timeline || null,
        annual_revenue: data.businessContext?.annualRevenue || null,
        current_tools: data.businessContext?.currentTools || [],
        pain_points: data.businessContext?.painPoints || [],
        landing_page: typeof window !== 'undefined' ? window.location.href : null,
        referrer_url: typeof document !== 'undefined' ? document.referrer : null,
      };

      // Insert lead
      const { data: lead, error } = await supabase
        .from('leads')
        .insert(leadData)
        .select()
        .single();

      if (error) {
        logger.error('Failed to create lead', { error, email: data.email });
        throw new Error(`Failed to create lead: ${error.message}`);
      }

      // Calculate and update lead score
      const score = await this.calculateLeadScore(lead.id);
      if (score > 0) {
        await this.updateLeadScore(lead.id, score);
        lead.lead_score = score;
      }

      // Track creation activity
      await this.addActivity({
        lead_id: lead.id,
        activity_type: 'form_submitted',
        title: 'Lead created',
        description: `Lead created from ${data.source}`,
        automated: true,
        metadata: {
          source: data.source,
          utm_data: data.utmData,
          initial_score: score,
        },
      });

      telemetry.track('lead_created', {
        source: data.source,
        score,
        hasAssessment: !!data.assessmentData?.completed,
      });

      logger.info('Lead created successfully', { 
        leadId: lead.id, 
        email: data.email, 
        score 
      });

      return lead;
    } catch (error) {
      logger.error('Error creating lead', { error, email: data.email });
      throw error;
    }
  }

  /**
   * Find lead by email address
   */
  async findLeadByEmail(email: string): Promise<Lead | null> {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('email', email.toLowerCase())
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw error;
      }

      return data || null;
    } catch (error) {
      logger.error('Error finding lead by email', { error, email });
      throw error;
    }
  }

  /**
   * Get paginated list of leads with filtering and sorting
   */
  async getLeads(options: LeadListOptions = {}): Promise<{
    leads: Lead[];
    total: number;
    page: number;
    pageSize: number;
  }> {
    try {
      const {
        page = 1,
        pageSize = 50,
        sortBy = 'created_at',
        sortOrder = 'desc',
        filters = {},
      } = options;

      let query = supabase
        .from('leads')
        .select('*', { count: 'exact' });

      // Apply filters
      if (filters.status?.length) {
        query = query.in('status', filters.status);
      }

      if (filters.priority?.length) {
        query = query.in('priority', filters.priority);
      }

      if (filters.source?.length) {
        query = query.in('source', filters.source);
      }

      if (filters.assignedTo) {
        query = query.eq('assigned_to', filters.assignedTo);
      }

      if (filters.search) {
        query = query.or(`name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,company.ilike.%${filters.search}%`);
      }

      if (filters.dateRange) {
        query = query.gte('created_at', filters.dateRange.from)
                     .lte('created_at', filters.dateRange.to);
      }

      if (filters.tags?.length) {
        query = query.overlaps('tags', filters.tags);
      }

      if (filters.leadScore) {
        query = query.gte('lead_score', filters.leadScore.min)
                     .lte('lead_score', filters.leadScore.max);
      }

      // Apply sorting and pagination
      query = query
        .order(sortBy, { ascending: sortOrder === 'asc' })
        .range((page - 1) * pageSize, page * pageSize - 1);

      const { data: leads, error, count } = await query;

      if (error) {
        throw error;
      }

      return {
        leads: leads || [],
        total: count || 0,
        page,
        pageSize,
      };
    } catch (error) {
      logger.error('Error fetching leads', { error, options });
      throw error;
    }
  }

  /**
   * Get lead by ID with full details
   */
  async getLeadById(id: string): Promise<Lead | null> {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('id', id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return data || null;
    } catch (error) {
      logger.error('Error fetching lead by ID', { error, id });
      throw error;
    }
  }

  /**
   * Update lead information
   */
  async updateLead(id: string, updates: LeadUpdate): Promise<Lead> {
    try {
      logger.info('Updating lead', { leadId: id, updates });

      const { data: lead, error } = await supabase
        .from('leads')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Track update activity
      await this.addActivity({
        lead_id: id,
        activity_type: 'note_added',
        title: 'Lead updated',
        description: 'Lead information updated',
        automated: true,
        metadata: { updates },
      });

      telemetry.track('lead_updated', { leadId: id });

      return lead;
    } catch (error) {
      logger.error('Error updating lead', { error, id });
      throw error;
    }
  }

  /**
   * Update lead status with activity tracking
   */
  async updateLeadStatus(id: string, status: string, notes?: string): Promise<Lead> {
    try {
      const lead = await this.updateLead(id, { 
        status: status as any,
        last_contact_at: new Date().toISOString(),
      });

      // Track status change
      await this.addActivity({
        lead_id: id,
        activity_type: 'status_changed',
        title: `Status changed to ${status}`,
        description: notes || `Lead status updated to ${status}`,
        automated: false,
        metadata: { 
          previous_status: status, 
          new_status: status,
          notes,
        },
      });

      return lead;
    } catch (error) {
      logger.error('Error updating lead status', { error, id, status });
      throw error;
    }
  }

  /**
   * Add activity to lead timeline
   */
  async addActivity(activity: LeadActivityInsert): Promise<LeadActivity> {
    try {
      const { data, error } = await supabase
        .from('lead_activities')
        .insert({
          ...activity,
          ip_address: typeof window !== 'undefined' ? null : null, // Could be enhanced with IP detection
          user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      logger.error('Error adding lead activity', { error, activity });
      throw error;
    }
  }

  /**
   * Get lead activities timeline
   */
  async getLeadActivities(leadId: string, limit = 50): Promise<LeadActivity[]> {
    try {
      const { data, error } = await supabase
        .from('lead_activities')
        .select('*')
        .eq('lead_id', leadId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
      logger.error('Error fetching lead activities', { error, leadId });
      throw error;
    }
  }

  /**
   * Calculate lead score based on scoring rules
   */
  async calculateLeadScore(leadId: string): Promise<number> {
    try {
      const lead = await this.getLeadById(leadId);
      if (!lead) {
        throw new Error('Lead not found');
      }

      // Get active scoring rules
      const { data: rules, error } = await supabase
        .from('lead_scoring_rules')
        .select('*')
        .eq('is_active', true)
        .order('priority', { ascending: false });

      if (error) {
        throw error;
      }

      let totalScore = 0;

      for (const rule of rules || []) {
        const fieldValue = this.getLeadFieldValue(lead, rule.field_name);
        const ruleMatches = this.evaluateRule(fieldValue, rule.operator, rule.value);
        
        if (ruleMatches) {
          totalScore += rule.score_impact;
          logger.debug('Lead scoring rule matched', {
            leadId,
            rule: rule.name,
            impact: rule.score_impact,
            totalScore,
          });
        }
      }

      // Ensure score is between 0 and 100
      const finalScore = Math.max(0, Math.min(100, totalScore));

      logger.info('Lead score calculated', { leadId, score: finalScore });
      
      return finalScore;
    } catch (error) {
      logger.error('Error calculating lead score', { error, leadId });
      return 0;
    }
  }

  /**
   * Update lead score
   */
  async updateLeadScore(leadId: string, score: number): Promise<void> {
    try {
      await supabase
        .from('leads')
        .update({ lead_score: score })
        .eq('id', leadId);

      await this.addActivity({
        lead_id: leadId,
        activity_type: 'score_changed',
        title: 'Lead score updated',
        description: `Lead score updated to ${score}`,
        automated: true,
        metadata: { new_score: score },
      });
    } catch (error) {
      logger.error('Error updating lead score', { error, leadId, score });
      throw error;
    }
  }

  /**
   * Get lead statistics and metrics
   */
  async getLeadStats(filters?: LeadListFilters): Promise<LeadStats> {
    try {
      let query = supabase.from('leads').select('status, source, priority, lead_score, estimated_deal_value');

      // Apply same filters as lead list
      if (filters?.status?.length) {
        query = query.in('status', filters.status);
      }
      if (filters?.source?.length) {
        query = query.in('source', filters.source);
      }
      if (filters?.dateRange) {
        query = query.gte('created_at', filters.dateRange.from)
                     .lte('created_at', filters.dateRange.to);
      }

      const { data: leads, error } = await query;

      if (error) {
        throw error;
      }

      const stats: LeadStats = {
        total: leads?.length || 0,
        byStatus: {},
        bySource: {},
        byPriority: {},
        conversionRate: 0,
        averageScore: 0,
        totalValue: 0,
      };

             if (leads) {
         // Calculate stats
         leads.forEach((lead: any) => {
           stats.byStatus[lead.status] = (stats.byStatus[lead.status] || 0) + 1;
           stats.bySource[lead.source] = (stats.bySource[lead.source] || 0) + 1;
           stats.byPriority[lead.priority] = (stats.byPriority[lead.priority] || 0) + 1;
           stats.totalValue += lead.estimated_deal_value || 0;
         });

         stats.averageScore = leads.reduce((sum: number, lead: any) => sum + (lead.lead_score || 0), 0) / leads.length;
         
         const convertedLeads = leads.filter((lead: any) => 
           lead.status === 'closed_won' || lead.status === 'qualified'
         ).length;
         stats.conversionRate = stats.total > 0 ? (convertedLeads / stats.total) * 100 : 0;
       }

      return stats;
    } catch (error) {
      logger.error('Error calculating lead stats', { error, filters });
      throw error;
    }
  }

  /**
   * Delete a lead and all associated activities
   */
  async deleteLead(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      telemetry.track('lead_deleted', { leadId: id });
      logger.info('Lead deleted', { leadId: id });
    } catch (error) {
      logger.error('Error deleting lead', { error, id });
      throw error;
    }
  }

  /**
   * Export leads to CSV format
   */
  async exportLeads(filters?: LeadListFilters): Promise<string> {
    try {
      const { leads } = await this.getLeads({ 
        pageSize: 10000, // Large limit for export
        filters 
      });

      const csvHeaders = [
        'Name', 'Email', 'Phone', 'Company', 'Industry', 'Source', 
        'Status', 'Priority', 'Score', 'Created Date', 'Last Activity'
      ].join(',');

      const csvRows = leads.map(lead => [
        `"${lead.name}"`,
        `"${lead.email}"`,
        `"${lead.phone || ''}"`,
        `"${lead.company || ''}"`,
        `"${lead.industry || ''}"`,
        `"${lead.source}"`,
        `"${lead.status}"`,
        `"${lead.priority}"`,
        lead.lead_score,
        `"${new Date(lead.created_at).toLocaleDateString()}"`,
        `"${new Date(lead.last_activity_at).toLocaleDateString()}"`
      ].join(','));

      return [csvHeaders, ...csvRows].join('\n');
    } catch (error) {
      logger.error('Error exporting leads', { error, filters });
      throw error;
    }
  }

  // Private helper methods

  private buildUpdateFromCreateData(data: CreateLeadData): LeadUpdate {
    return {
      company: data.company || null,
      industry: data.industry || null,
      phone: data.phone || null,
      source_details: { ...data.sourceDetails },
      utm_source: data.utmData?.source || null,
      utm_medium: data.utmData?.medium || null,
      utm_campaign: data.utmData?.campaign || null,
      assessment_completed: data.assessmentData?.completed || false,
      assessment_score: data.assessmentData?.score || null,
      assessment_data: data.assessmentData?.responses || {},
      company_size: data.businessContext?.companySize || null,
      process_volume: data.businessContext?.processVolume || null,
      timeline_expectation: data.businessContext?.timeline || null,
      annual_revenue: data.businessContext?.annualRevenue || null,
      current_tools: data.businessContext?.currentTools || [],
      pain_points: data.businessContext?.painPoints || [],
    };
  }

  private getLeadFieldValue(lead: Lead, fieldName: string): any {
    // Handle nested field access (e.g., 'assessment_data.score')
    const parts = fieldName.split('.');
    let value: any = lead;
    
    for (const part of parts) {
      value = value?.[part as keyof typeof value];
    }
    
    return value;
  }

  private evaluateRule(fieldValue: any, operator: string, ruleValue: string): boolean {
    switch (operator) {
      case 'equals':
        return fieldValue === ruleValue;
      case 'not_equals':
        return fieldValue !== ruleValue;
      case 'contains':
        return String(fieldValue || '').toLowerCase().includes(ruleValue.toLowerCase());
      case 'not_contains':
        return !String(fieldValue || '').toLowerCase().includes(ruleValue.toLowerCase());
      case 'greater_than':
        return Number(fieldValue || 0) > Number(ruleValue);
      case 'less_than':
        return Number(fieldValue || 0) < Number(ruleValue);
      case 'in':
        const values = ruleValue.split(',').map(v => v.trim());
        return values.includes(String(fieldValue));
      case 'not_in':
        const notValues = ruleValue.split(',').map(v => v.trim());
        return !notValues.includes(String(fieldValue));
      default:
        return false;
    }
  }
}

// Export singleton instance
export const leadService = new LeadService(); 