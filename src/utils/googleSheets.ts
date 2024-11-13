import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

const initializeSheet = async () => {
  const SHEET_ID = import.meta.env.VITE_GOOGLE_SHEET_ID;
  const GOOGLE_CLIENT_EMAIL = import.meta.env.VITE_GOOGLE_CLIENT_EMAIL;
  const GOOGLE_PRIVATE_KEY = import.meta.env.VITE_GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!SHEET_ID || !GOOGLE_CLIENT_EMAIL || !GOOGLE_PRIVATE_KEY) {
    throw new Error('Missing required environment variables for Google Sheets integration');
  }

  try {
    const serviceAccountAuth = new JWT({
      email: GOOGLE_CLIENT_EMAIL,
      key: GOOGLE_PRIVATE_KEY,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const doc = new GoogleSpreadsheet(SHEET_ID, serviceAccountAuth);
    await doc.loadInfo();
    return doc;
  } catch (error: any) {
    console.error('Failed to initialize sheet:', {
      error: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data
    });
    throw error;
  }
};

export const saveFormDataToSheet = async (
  formData?: any,
  assessmentResults?: any
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