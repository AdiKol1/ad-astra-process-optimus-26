import { GoogleSpreadsheet } from 'google-spreadsheet';
import type { AuditFormData } from '@/types/assessment';

// Initialize the sheet
const initializeSheet = async () => {
  try {
    const doc = new GoogleSpreadsheet(process.env.VITE_GOOGLE_SHEET_ID);

    // Initialize auth
    await doc.useServiceAccountAuth({
      client_email: process.env.VITE_GOOGLE_SERVICE_ACCOUNT_EMAIL!,
      private_key: process.env.VITE_GOOGLE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
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
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      employees: formData.employees,
      processVolume: formData.processVolume,
      industry: formData.industry,
      timelineExpectation: formData.timelineExpectation,
      message: formData.message || '',
    });

    return true;
  } catch (error) {
    console.error('Error saving to Google Sheet:', error);
    throw error;
  }
};