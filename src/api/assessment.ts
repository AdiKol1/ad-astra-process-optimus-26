import { supabase } from './config';
import type { ApiResponse, AssessmentResponse } from './types';

export const assessmentApi = {
  async submitAssessment(data: Partial<AssessmentResponse>): Promise<ApiResponse<AssessmentResponse>> {
    try {
      const { data: responseData, error } = await supabase
        .from('assessments')
        .insert([data])
        .select()
        .single();

      if (error) throw error;

      return {
        data: responseData,
        error: null,
        status: 200,
      };
    } catch (error: any) {
      return {
        data: null,
        error: error.message,
        status: error.status || 500,
      };
    }
  },

  async getAssessment(id: string): Promise<ApiResponse<AssessmentResponse>> {
    try {
      const { data: responseData, error } = await supabase
        .from('assessments')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      return {
        data: responseData,
        error: null,
        status: 200,
      };
    } catch (error: any) {
      return {
        data: null,
        error: error.message,
        status: error.status || 500,
      };
    }
  },

  async updateAssessment(id: string, data: Partial<AssessmentResponse>): Promise<ApiResponse<AssessmentResponse>> {
    try {
      const { data: responseData, error } = await supabase
        .from('assessments')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return {
        data: responseData,
        error: null,
        status: 200,
      };
    } catch (error: any) {
      return {
        data: null,
        error: error.message,
        status: error.status || 500,
      };
    }
  },
};
