import { supabase } from './supabase';

export const saveFormDataToSheet = async (formData: any) => {
  try {
    // Transform form data to match spreadsheet columns
    const spreadsheetRow = {
      name: formData.firstName ? `${formData.firstName} ${formData.lastName || ''}` : '',
      email: formData.email || '',
      phone_number: formData.phoneNumber || '',
      industry: formData.industry || '',
      implementation_timeline: formData.timelineExpectation || '',
      employees: formData.employees || '',
      process_volume: formData.processVolume || '',
      opportunity_value: calculateOpportunityValue(formData),
      stage: 'Prospect',
      created_at: new Date().toISOString()
    };

    console.log('Attempting to save to Google Sheets:', spreadsheetRow);

    const { data, error } = await supabase.functions.invoke('save-to-sheets', {
      body: { 
        formData: spreadsheetRow,
        sheetName: 'AD Astra Leads' // Match the sheet name in your Google Sheet
      }
    });

    if (error) {
      console.error('Supabase Edge Function error:', error);
      throw error;
    }

    console.log('Successfully saved to Google Sheets:', data);
    
    return {
      success: true,
      message: 'Data saved successfully',
      data
    };
  } catch (error) {
    console.error('Error saving to Google Sheets:', error);
    // Re-throw the error to be handled by the form component
    throw error;
  }
};

// Helper function to calculate opportunity value based on company size and process volume
const calculateOpportunityValue = (formData: any): string => {
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