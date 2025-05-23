export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      chat_messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          is_user: boolean | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          is_user?: boolean | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          is_user?: boolean | null
          user_id?: string
        }
        Relationships: []
      }
      leads: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          name: string
          email: string
          phone: string | null
          company: string | null
          industry: string | null
          job_title: string | null
          source: string
          source_details: Json
          utm_source: string | null
          utm_medium: string | null
          utm_campaign: string | null
          utm_content: string | null
          utm_term: string | null
          referrer_url: string | null
          landing_page: string | null
          assessment_id: string | null
          assessment_completed: boolean
          assessment_score: number | null
          assessment_data: Json
          company_size: string | null
          process_volume: string | null
          timeline_expectation: string | null
          annual_revenue: string | null
          current_tools: string[] | null
          pain_points: string[] | null
          status: 'new' | 'contacted' | 'qualified' | 'demo_scheduled' | 'proposal_sent' | 'negotiation' | 'closed_won' | 'closed_lost' | 'nurturing' | 'unresponsive'
          priority: 'low' | 'medium' | 'high' | 'urgent'
          lead_score: number
          qualification_score: number
          assigned_to: string | null
          assigned_at: string | null
          tags: string[]
          lead_type: 'prospect' | 'marketing_qualified' | 'sales_qualified' | 'opportunity' | 'customer'
          notes: string | null
          internal_notes: string | null
          last_activity_at: string
          last_contact_at: string | null
          next_follow_up_at: string | null
          email_opens: number
          email_clicks: number
          email_bounces: number
          email_unsubscribed: boolean
          website_sessions: number
          page_views: number
          time_on_site: number
          pages_visited: string[]
          estimated_deal_value: number
          estimated_monthly_value: number
          estimated_close_date: string | null
          probability: number
          first_contact_date: string | null
          last_qualification_date: string | null
          conversion_date: string | null
          custom_fields: Json
          integration_data: Json
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          name: string
          email: string
          phone?: string | null
          company?: string | null
          industry?: string | null
          job_title?: string | null
          source?: string
          source_details?: Json
          utm_source?: string | null
          utm_medium?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_term?: string | null
          referrer_url?: string | null
          landing_page?: string | null
          assessment_id?: string | null
          assessment_completed?: boolean
          assessment_score?: number | null
          assessment_data?: Json
          company_size?: string | null
          process_volume?: string | null
          timeline_expectation?: string | null
          annual_revenue?: string | null
          current_tools?: string[] | null
          pain_points?: string[] | null
          status?: 'new' | 'contacted' | 'qualified' | 'demo_scheduled' | 'proposal_sent' | 'negotiation' | 'closed_won' | 'closed_lost' | 'nurturing' | 'unresponsive'
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          lead_score?: number
          qualification_score?: number
          assigned_to?: string | null
          assigned_at?: string | null
          tags?: string[]
          lead_type?: 'prospect' | 'marketing_qualified' | 'sales_qualified' | 'opportunity' | 'customer'
          notes?: string | null
          internal_notes?: string | null
          last_activity_at?: string
          last_contact_at?: string | null
          next_follow_up_at?: string | null
          email_opens?: number
          email_clicks?: number
          email_bounces?: number
          email_unsubscribed?: boolean
          website_sessions?: number
          page_views?: number
          time_on_site?: number
          pages_visited?: string[]
          estimated_deal_value?: number
          estimated_monthly_value?: number
          estimated_close_date?: string | null
          probability?: number
          first_contact_date?: string | null
          last_qualification_date?: string | null
          conversion_date?: string | null
          custom_fields?: Json
          integration_data?: Json
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          name?: string
          email?: string
          phone?: string | null
          company?: string | null
          industry?: string | null
          job_title?: string | null
          source?: string
          source_details?: Json
          utm_source?: string | null
          utm_medium?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_term?: string | null
          referrer_url?: string | null
          landing_page?: string | null
          assessment_id?: string | null
          assessment_completed?: boolean
          assessment_score?: number | null
          assessment_data?: Json
          company_size?: string | null
          process_volume?: string | null
          timeline_expectation?: string | null
          annual_revenue?: string | null
          current_tools?: string[] | null
          pain_points?: string[] | null
          status?: 'new' | 'contacted' | 'qualified' | 'demo_scheduled' | 'proposal_sent' | 'negotiation' | 'closed_won' | 'closed_lost' | 'nurturing' | 'unresponsive'
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          lead_score?: number
          qualification_score?: number
          assigned_to?: string | null
          assigned_at?: string | null
          tags?: string[]
          lead_type?: 'prospect' | 'marketing_qualified' | 'sales_qualified' | 'opportunity' | 'customer'
          notes?: string | null
          internal_notes?: string | null
          last_activity_at?: string
          last_contact_at?: string | null
          next_follow_up_at?: string | null
          email_opens?: number
          email_clicks?: number
          email_bounces?: number
          email_unsubscribed?: boolean
          website_sessions?: number
          page_views?: number
          time_on_site?: number
          pages_visited?: string[]
          estimated_deal_value?: number
          estimated_monthly_value?: number
          estimated_close_date?: string | null
          probability?: number
          first_contact_date?: string | null
          last_qualification_date?: string | null
          conversion_date?: string | null
          custom_fields?: Json
          integration_data?: Json
        }
        Relationships: []
      }
      lead_activities: {
        Row: {
          id: string
          lead_id: string
          created_at: string
          activity_type: 'email_sent' | 'email_opened' | 'email_clicked' | 'email_replied' | 'call_made' | 'call_received' | 'voicemail_left' | 'voicemail_received' | 'meeting_scheduled' | 'meeting_completed' | 'demo_completed' | 'proposal_sent' | 'contract_sent' | 'contract_signed' | 'note_added' | 'status_changed' | 'score_changed' | 'assigned' | 'website_visit' | 'page_view' | 'form_submitted' | 'download' | 'social_interaction' | 'referral_made' | 'assessment_started' | 'assessment_completed'
          title: string
          description: string | null
          performed_by: string | null
          automated: boolean
          metadata: Json
          email_subject: string | null
          email_template_id: string | null
          email_status: string | null
          call_duration: number | null
          call_outcome: string | null
          call_notes: string | null
          meeting_type: string | null
          meeting_duration: number | null
          meeting_attendees: string[] | null
          ip_address: string | null
          user_agent: string | null
          referrer_url: string | null
          external_id: string | null
          external_system: string | null
        }
        Insert: {
          id?: string
          lead_id: string
          created_at?: string
          activity_type: 'email_sent' | 'email_opened' | 'email_clicked' | 'email_replied' | 'call_made' | 'call_received' | 'voicemail_left' | 'voicemail_received' | 'meeting_scheduled' | 'meeting_completed' | 'demo_completed' | 'proposal_sent' | 'contract_sent' | 'contract_signed' | 'note_added' | 'status_changed' | 'score_changed' | 'assigned' | 'website_visit' | 'page_view' | 'form_submitted' | 'download' | 'social_interaction' | 'referral_made' | 'assessment_started' | 'assessment_completed'
          title: string
          description?: string | null
          performed_by?: string | null
          automated?: boolean
          metadata?: Json
          email_subject?: string | null
          email_template_id?: string | null
          email_status?: string | null
          call_duration?: number | null
          call_outcome?: string | null
          call_notes?: string | null
          meeting_type?: string | null
          meeting_duration?: number | null
          meeting_attendees?: string[] | null
          ip_address?: string | null
          user_agent?: string | null
          referrer_url?: string | null
          external_id?: string | null
          external_system?: string | null
        }
        Update: {
          id?: string
          lead_id?: string
          created_at?: string
          activity_type?: 'email_sent' | 'email_opened' | 'email_clicked' | 'email_replied' | 'call_made' | 'call_received' | 'voicemail_left' | 'voicemail_received' | 'meeting_scheduled' | 'meeting_completed' | 'demo_completed' | 'proposal_sent' | 'contract_sent' | 'contract_signed' | 'note_added' | 'status_changed' | 'score_changed' | 'assigned' | 'website_visit' | 'page_view' | 'form_submitted' | 'download' | 'social_interaction' | 'referral_made' | 'assessment_started' | 'assessment_completed'
          title?: string
          description?: string | null
          performed_by?: string | null
          automated?: boolean
          metadata?: Json
          email_subject?: string | null
          email_template_id?: string | null
          email_status?: string | null
          call_duration?: number | null
          call_outcome?: string | null
          call_notes?: string | null
          meeting_type?: string | null
          meeting_duration?: number | null
          meeting_attendees?: string[] | null
          ip_address?: string | null
          user_agent?: string | null
          referrer_url?: string | null
          external_id?: string | null
          external_system?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lead_activities_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          }
        ]
      }
      lead_scoring_rules: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          name: string
          description: string | null
          category: string
          field_name: string
          operator: 'equals' | 'not_equals' | 'contains' | 'not_contains' | 'greater_than' | 'less_than' | 'in' | 'not_in'
          value: string
          score_impact: number
          is_active: boolean
          priority: number
          created_by: string | null
          notes: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          name: string
          description?: string | null
          category: string
          field_name: string
          operator: 'equals' | 'not_equals' | 'contains' | 'not_contains' | 'greater_than' | 'less_than' | 'in' | 'not_in'
          value: string
          score_impact: number
          is_active?: boolean
          priority?: number
          created_by?: string | null
          notes?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          name?: string
          description?: string | null
          category?: string
          field_name?: string
          operator?: 'equals' | 'not_equals' | 'contains' | 'not_contains' | 'greater_than' | 'less_than' | 'in' | 'not_in'
          value?: string
          score_impact?: number
          is_active?: boolean
          priority?: number
          created_by?: string | null
          notes?: string | null
        }
        Relationships: []
      }
      logs: {
        Row: {
          id: string
          created_at: string
          level: string
          message: string
          data: Json | null
          environment: string
          source: string | null
          user_session_id: string | null
          user_agent: string | null
          url: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          level: string
          message: string
          data?: Json | null
          environment: string
          source?: string | null
          user_session_id?: string | null
          user_agent?: string | null
          url?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          level?: string
          message?: string
          data?: Json | null
          environment?: string
          source?: string | null
          user_session_id?: string | null
          user_agent?: string | null
          url?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

// Helper types for leads management
export type Lead = Tables<'leads'>
export type LeadInsert = TablesInsert<'leads'>
export type LeadUpdate = TablesUpdate<'leads'>

export type LeadActivity = Tables<'lead_activities'>
export type LeadActivityInsert = TablesInsert<'lead_activities'>
export type LeadActivityUpdate = TablesUpdate<'lead_activities'>

export type LeadScoringRule = Tables<'lead_scoring_rules'>
export type LeadScoringRuleInsert = TablesInsert<'lead_scoring_rules'>
export type LeadScoringRuleUpdate = TablesUpdate<'lead_scoring_rules'>
