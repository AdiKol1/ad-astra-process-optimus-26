import { GoogleSpreadsheet } from 'google-spreadsheet';
import type { AuditFormData, AssessmentResults } from '@/types/assessment';

const initializeSheet = async () => {
  const SHEET_ID = import.meta.env.VITE_GOOGLE_SHEET_ID;
  const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

  if (!SHEET_ID || !API_KEY) {
    console.error('Missing environment variables:', {
      hasSheetId: !!SHEET_ID,
      hasApiKey: !!API_KEY
    });
    throw new Error('Missing required environment variables for Google Sheets integration');
  }

  try {
    console.log('Attempting to connect to spreadsheet with ID:', SHEET_ID);
    const doc = new GoogleSpreadsheet(SHEET_ID, { apiKey: API_KEY });
    await doc.loadInfo();
    console.log('Successfully connected to spreadsheet:', doc.title);
    console.log('Available sheets:', doc.sheetsByIndex.map(sheet => sheet.title));
    return doc;
  } catch (error: any) {
    console.error('Error initializing Google Sheet:', error);
    console.error('Error details:', {
      message: error.message,
      status: error.status,
      response: error.response?.data
    });
    
    if (error.status === 403) {
      throw new Error('Google Sheets API permission denied. Please check your API key permissions and ensure the sheet is shared properly.');
    }
    throw new Error('Failed to initialize Google Sheets connection');
  }
};

export const saveFormDataToSheet = async (
  formData: AuditFormData,
  assessmentResults?: AssessmentResults
) => {
  try {
    console.log('Starting saveFormDataToSheet process...');
    const doc = await initializeSheet();
    const sheet = doc.sheetsByIndex[0];

    if (!sheet) {
      console.error('No sheets found in the document');
      throw new Error('No sheet found in the specified Google Spreadsheet');
    }

    console.log('Attempting to save to sheet:', sheet.title);

    // Format the data for the sheet
    const rowData = {
      timestamp: new Date().toISOString(),
      name: formData.name || '',
      email: formData.email || '',
      phone: formData.phone || '',
      industry: formData.industry || '',
      employees: formData.employees || '',
      process_volume: formData.processVolume || '',
      implementation_timeline: formData.timelineExpectation || '',
      message: formData.message || '',
      // Assessment results if available
      automation_score: assessmentResults?.assessmentScore?.overall || '',
      automation_potential: assessmentResults?.assessmentScore?.automationPotential || '',
      annual_savings: assessmentResults?.results?.annual?.savings || '',
      annual_hours_saved: assessmentResults?.results?.annual?.hours || '',
    };

    console.log('Saving row data:', rowData);

    // Add the row to the sheet
    await sheet.addRow(rowData);
    console.log('Successfully saved data to Google Sheet');
    return true;
  } catch (error: any) {
    console.error('Error saving to Google Sheet:', error);
    console.error('Error details:', {
      message: error.message,
      status: error.status,
      response: error.response?.data
    });
    throw error;
  }
};