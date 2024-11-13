const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const SHEET_ID = import.meta.env.VITE_GOOGLE_SHEET_ID;

// Save form data to Google Sheet
export const saveFormDataToSheet = async (formData?: any, assessmentResults?: any) => {
  if (!SHEET_ID) {
    console.error('Missing Google Sheet ID:', SHEET_ID);
    throw new Error('Missing Google Sheet ID in environment variables');
  }

  if (!API_KEY) {
    console.error('Missing Google API Key:', API_KEY);
    throw new Error('Missing Google API Key in environment variables');
  }

  try {
    console.log('Starting saveFormDataToSheet with:', {
      sheetId: SHEET_ID,
      hasApiKey: !!API_KEY,
      formData: formData,
      assessmentResults: assessmentResults
    });

    // Format data to match spreadsheet columns exactly
    const values = [
      [
        assessmentResults?.results?.annual?.savings || '', // Opportunity Value
        formData?.name || '', // Name
        formData?.email || '', // Email
        formData?.phone || '', // Phone Number
        formData?.industry || '', // Industry
        formData?.timelineExpectation || '', // Implementation Timeline
        'New Lead', // Stage
        assessmentResults?.results?.annual?.savings || '' // Est. value
      ]
    ];

    console.log('Formatted values for sheet:', values);

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Sheet1!A:H:append?valueInputOption=USER_ENTERED&key=${API_KEY}`;
    console.log('Making request to:', url);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ values })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Google Sheets API Error Response:', errorData);
      throw new Error(`Failed to save to Google Sheets: ${errorData.error?.message || 'Unknown error'}`);
    }

    const responseData = await response.json();
    console.log('Successfully saved to sheet. Response:', responseData);

    return true;
  } catch (error: any) {
    console.error('Failed to save to sheet:', error);
    throw error;
  }
};