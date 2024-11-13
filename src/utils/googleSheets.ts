import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const SHEET_ID = import.meta.env.VITE_GOOGLE_SHEET_ID;
const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = import.meta.env.VITE_GOOGLE_REDIRECT_URI;

const oauth2Client = new OAuth2Client(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

// Save form data to Google Sheet
export const saveFormDataToSheet = async (formData?: any, assessmentResults?: any) => {
  if (!SHEET_ID) {
    console.error('Missing Google Sheet ID:', SHEET_ID);
    throw new Error('Missing Google Sheet ID in environment variables');
  }

  try {
    console.log('Starting saveFormDataToSheet with:', {
      sheetId: SHEET_ID,
      formData: formData,
      assessmentResults: assessmentResults
    });

    // Format data to match spreadsheet columns exactly
    const values = [
      [
        assessmentResults?.results?.annual?.savings || '', // A: Opportunity Value
        formData?.name || '', // B: Name
        formData?.email || '', // C: Email
        formData?.phone || '', // D: Phone Number
        formData?.industry || '', // E: Industry
        formData?.timelineExpectation || '', // F: Implementation Timeline
        'New Lead', // G: Stage
        assessmentResults?.results?.annual?.savings || '' // H: Est. value
      ]
    ];

    console.log('Formatted values for sheet:', values);

    const sheets = google.sheets({ version: 'v4', auth: oauth2Client });
    
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: 'Sheet1!A:H',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values,
      },
    });

    console.log('Successfully saved to sheet. Response:', response.data);
    return true;

  } catch (error: any) {
    console.error('Failed to save to sheet:', error);
    throw new Error(`Failed to save to Google Sheets: ${error.message}`);
  }
};

// Get OAuth URL for authentication
export const getAuthUrl = () => {
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
};

// Handle OAuth callback
export const handleAuthCallback = async (code: string) => {
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  return tokens;
};