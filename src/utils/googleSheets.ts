import { GoogleSpreadsheet } from 'google-spreadsheet';
import type { AuditFormData, AssessmentResults } from '@/types/assessment';

const initializeSheet = async () => {
  const SHEET_ID = import.meta.env.VITE_GOOGLE_SHEET_ID;
  const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

  if (!SHEET_ID || !API_KEY) {
    throw new Error('Missing required environment variables for Google Sheets integration');
  }

  try {
    const doc = new GoogleSpreadsheet(SHEET_ID, { apiKey: API_KEY });
    await doc.loadInfo();
    return doc;
  } catch (error: any) {
    if (error.response?.status === 403) {
      throw new Error(
        'Access denied to Google Sheet. Please ensure:\n' +
        '1. The Google Sheet is shared with "Anyone with the link"\n' +
        '2. The API key has access to Google Sheets API\n' +
        '3. The API key restrictions allow access from your domain'
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
    console.error('Google Sheets Error:', {
      message: error.message,
      status: error.response?.status,
      details: error.response?.data
    });
    throw error;
  }
};