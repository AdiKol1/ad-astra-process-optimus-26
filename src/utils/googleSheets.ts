import { supabase } from './supabase';
import type { AuditFormData } from '@/types/assessment';

export const saveFormDataToSheet = async (formData: AuditFormData) => {
  try {
    console.log('Starting form data save process:', formData);
    
    if (!formData) {
      throw new Error('No form data provided');
    }

    // Transform form data to match spreadsheet columns
    const spreadsheetRow = {
      timestamp: new Date().toISOString(),
      name: formData.name || '',
      email: formData.email || '',
      phone: formData.phone || '',
      company: formData.company || '',
      employees: formData.employees || '',
      industry: formData.industry || '',
      implementation_timeline: formData.timelineExpectation || '',
      process_volume: formData.processVolume || '',
      opportunity_value: calculateOpportunityValue(formData),
      stage: 'Prospect',
      created_at: new Date().toISOString()
    };

    console.log('Transformed spreadsheet data:', spreadsheetRow);

    const { data, error } = await supabase.functions.invoke('save-to-sheets', {
      body: { 
        formData: spreadsheetRow,
        sheetName: 'AD Astra Leads'
      }
    });

    if (error) {
      console.error('Supabase Edge Function error:', error);
      throw new Error(`Failed to save to sheet: ${error.message}`);
    }

    console.log('Successfully saved to Google Sheets:', data);
    
    return {
      success: true,
      message: 'Data saved successfully',
      data
    };
  } catch (error: any) {
    console.error('Error in saveFormDataToSheet:', error);
    throw new Error(error.message || 'Failed to save form data');
  }
};

// Helper function to calculate opportunity value based on company size and process volume
const calculateOpportunityValue = (formData: AuditFormData): string => {
  const employeeCount = parseInt(formData.employees) || 0;
  const volumeMap: { [key: string]: number } = {
    'Less than 100': 100,
    '100-500': 300,
    '501-1000': 750,
    '1001-5000': 3000,
    'More than 5000': 5000
  };
  
  const processVolume = volumeMap[formData.processVolume] || 0;
  
  // Basic calculation: $100 per employee + $1 per monthly transaction
  const baseValue = (employeeCount * 100) + (processVolume * 1);
  
  return `$${baseValue.toLocaleString()}`;
};