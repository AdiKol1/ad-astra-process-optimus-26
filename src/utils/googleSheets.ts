import { GoogleSpreadsheet } from 'google-spreadsheet';
import type { AuditFormData, AssessmentResults } from '@/types/assessment';

const initializeSheet = async () => {
  const SHEET_ID = import.meta.env.VITE_GOOGLE_SHEET_ID;
  const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

  if (!SHEET_ID || !API_KEY) {
    console.error('Missing environment variables:', { SHEET_ID: !!SHEET_ID, API_KEY: !!API_KEY });
    throw new Error('Missing required environment variables for Google Sheets integration');
  }

  try {
    console.log('Initializing Google Sheet with ID:', SHEET_ID);
    const doc = new GoogleSpreadsheet(SHEET_ID);
    await doc.useApiKey(API_KEY);
    
    console.log('Loading sheet info...');
    await doc.loadInfo();
    console.log('Sheet loaded successfully:', doc.title);
    
    return doc;
  } catch (error: any) {
    console.error('Failed to initialize sheet:', {
      error: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data
    });

    if (error.response?.status === 403) {
      throw new Error(
        'Access denied to Google Sheet. Please check:\n' +
        '1. The Google Sheet is shared with "Anyone with the link"\n' +
        '2. The Google Sheets API is enabled in Google Cloud Console\n' +
        '3. The API key has access to Google Sheets API\n' +
        '4. The domain restrictions for the API key include: localhost:* and run.gptengineer.app/*'
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
    console.log('Starting to save form data to sheet...');
    const doc = await initializeSheet();
    
    const sheet = doc.sheetsByIndex[0];
    if (!sheet) {
      throw new Error('No sheet found in the specified Google Spreadsheet');
    }

    console.log('Preparing row data...');
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

    console.log('Adding row to sheet:', rowData);
    await sheet.addRow(rowData);
    console.log('Row added successfully');
    
    return true;
  } catch (error: any) {
    console.error('Failed to save to sheet:', {
      error: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data
    });
    throw error;
  }
};