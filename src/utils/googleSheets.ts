import { GoogleSpreadsheet } from 'google-spreadsheet';
import type { AuditFormData } from '@/types/assessment';

// Initialize the sheet
const initializeSheet = async () => {
  const SHEET_ID = import.meta.env.VITE_GOOGLE_SHEET_ID;
  const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

  if (!SHEET_ID || !API_KEY) {
    throw new Error('Missing required environment variables for Google Sheets integration');
  }

  try {
    const doc = new GoogleSpreadsheet(SHEET_ID, {
      apiKey: API_KEY
    });
    
    await doc.loadInfo();
    return doc;
  } catch (error) {
    console.error('Error initializing Google Sheet:', error);
    throw new Error('Failed to initialize Google Sheets connection');
  }
};

export const saveFormDataToSheet = async (formData: AuditFormData) => {
  try {
    const doc = await initializeSheet();
    const sheet = doc.sheetsByIndex[0];

    if (!sheet) {
      throw new Error('No sheet found in the specified Google Spreadsheet');
    }

    // Add a new row with the form data
    await sheet.addRow({
      timestamp: new Date().toISOString(),
      employees: formData.employees,
      processVolume: formData.processVolume,
      industry: formData.industry,
      timelineExpectation: formData.timelineExpectation,
      message: formData.message || '',
    });

    return true;
  } catch (error) {
    console.error('Error saving to Google Sheet:', error);
    throw new Error('Failed to save form data to Google Sheets');
  }
};