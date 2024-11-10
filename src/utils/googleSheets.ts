import { GoogleSpreadsheet } from 'google-spreadsheet';
import { GoogleSpreadsheetWorksheet } from 'google-spreadsheet';
import type { AuditFormData } from '@/types/assessment';

// Initialize the sheet
const initializeSheet = async () => {
  try {
    const doc = new GoogleSpreadsheet(process.env.VITE_GOOGLE_SHEET_ID as string, {
      apiKey: process.env.VITE_GOOGLE_API_KEY as string
    });
    
    await doc.loadInfo();
    return doc;
  } catch (error) {
    console.error('Error initializing Google Sheet:', error);
    throw error;
  }
};

export const saveFormDataToSheet = async (formData: AuditFormData) => {
  try {
    const doc = await initializeSheet();
    const sheet = doc.sheetsByIndex[0]; // Uses the first sheet

    // Add a new row with the form data
    await sheet.addRow({
      timestamp: new Date().toISOString(),
      employees: formData.employees,
      processVolume: formData.processVolume,
      industry: formData.industry,
      timelineExpectation: formData.timelineExpectation,
    });

    return true;
  } catch (error) {
    console.error('Error saving to Google Sheet:', error);
    throw error;
  }
};