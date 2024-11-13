// Initialize Google OAuth client
declare const google: any; // Declare google as global

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const SHEET_ID = import.meta.env.VITE_GOOGLE_SHEET_ID;

// Initialize Google Auth
const initGoogleAuth = () => {
  if (typeof google === 'undefined') {
    throw new Error('Google API client not loaded');
  }
  return new google.auth.OAuth2(CLIENT_ID);
};

// Get user consent and access token
const getAccessToken = async () => {
  const auth = initGoogleAuth();
  try {
    const token = await auth.getAccessToken();
    return token;
  } catch (error) {
    console.error('Error getting access token:', error);
    throw new Error('Failed to authenticate with Google');
  }
};

// Save form data to Google Sheet
export const saveFormDataToSheet = async (formData?: any, assessmentResults?: any) => {
  if (!SHEET_ID) {
    throw new Error('Missing Google Sheet ID in environment variables');
  }

  try {
    const token = await getAccessToken();
    const values = [
      [
        new Date().toISOString(),
        formData?.name || '',
        formData?.email || '',
        formData?.phone || '',
        formData?.industry || '',
        formData?.employees || '',
        formData?.processVolume || '',
        formData?.timelineExpectation || '',
        formData?.message || '',
        assessmentResults?.assessmentScore?.overall || '',
        assessmentResults?.assessmentScore?.automationPotential || '',
        assessmentResults?.results?.annual?.savings || '',
        assessmentResults?.results?.annual?.hours || '',
      ]
    ];

    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Sheet1!A:M:append?valueInputOption=USER_ENTERED`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ values })
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to save to Google Sheets: ${errorData.error?.message || 'Unknown error'}`);
    }

    return true;
  } catch (error: any) {
    console.error('Failed to save to sheet:', error);
    throw error;
  }
};