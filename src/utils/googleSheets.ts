import { GoogleSpreadsheet } from 'google-spreadsheet';
import type { AuditFormData, AssessmentResults } from '@/types/assessment';

const initializeSheet = async () => {
  const SHEET_ID = import.meta.env.VITE_GOOGLE_SHEET_ID;
  const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

  if (!SHEET_ID || !API_KEY) {
    throw new Error('Missing required environment variables for Google Sheets integration');
  }

  try {
    const doc = new GoogleSpreadsheet(SHEET_ID);
    await doc.useApiKey(API_KEY);
    await doc.loadInfo();
    return doc;
  } catch (error: any) {
    console.error('Failed to initialize sheet:', {
      error: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data
    });

    // Provide more specific error messages based on the error type
    if (error.response?.status === 403) {
      const domain = window.location.hostname;
      throw new Error(
        `Access denied. Please ensure:\n` +
        `1. The domain "${domain}" is added to allowed referrers\n` +
        `2. The Google Sheets API is enabled\n` +
        `3. The API key has access to Google Sheets API`
      );
    }
    throw error;
  }
};

export const saveFormDataToSheet = async (
  formData?: AuditFormData,
  assessmentResults?: AssessmentResults
) => {
  try {
    const doc = await initializeSheet();
    const sheet = doc.sheetsByIndex[0];
    
    if (!sheet) {
      throw new Error('No sheet found in the specified Google Spreadsheet');
    }

    const rowData = {
      timestamp: new Date().toISOString(),
      name: formData?.name || '',
      email: formData?.email || '',
      phone: formData?.phone || '',
      industry: formData?.industry || '',
      employees: formData?.employees || '',
      process_volume: formData?.processVolume || '',
      implementation_timeline: formData?.timelineExpectation || '',
      message: formData?.message || '',
      automation_score: assessmentResults?.assessmentScore?.overall || '',
      automation_potential: assessmentResults?.assessmentScore?.automationPotential || '',
      annual_savings: assessmentResults?.results?.annual?.savings || '',
      annual_hours_saved: assessmentResults?.results?.annual?.hours || '',
    };

    await sheet.addRow(rowData);
    return true;
  } catch (error: any) {
    console.error('Failed to save to sheet:', error);
    throw error;
  }
};