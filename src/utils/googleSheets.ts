import { supabase } from './supabase';

export const saveFormDataToSheet = async (formData: any) => {
  try {
    console.log('Attempting to save form data:', {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      company: formData.company,
      role: formData.role
    });

    const { data, error } = await supabase.functions.invoke('save-to-sheets', {
      body: { formData }
    });

    if (error) throw error;

    console.log('Successfully saved to Google Sheets:', data);
    
    return {
      success: true,
      message: 'Data saved successfully'
    };
  } catch (error) {
    console.error('Error saving to Google Sheets:', error);
    throw error;
  }
};