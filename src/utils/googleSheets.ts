const SHEET_ID = import.meta.env.VITE_GOOGLE_SHEET_ID;

// Save form data to Google Sheet using fetch with proper authentication
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

    // Use Google Sheets API v4 with proper authentication
    const accessToken = await getAccessToken(); // You'll need to implement this
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Sheet1!A:H:append?valueInputOption=USER_ENTERED`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ values })
    });

    if (!response.ok) {
      throw new Error(`Failed to save to Google Sheets: ${response.statusText}`);
    }

    const responseData = await response.json();
    console.log('Successfully saved to sheet. Response:', responseData);
    return true;

  } catch (error: any) {
    console.error('Failed to save to sheet:', error);
    // For now, we'll just log the error and continue
    // This allows the assessment to complete even if the sheet save fails
    return false;
  }
};

// Mock function for testing - replace with actual OAuth implementation
const getAccessToken = async () => {
  throw new Error('OAuth implementation required. For testing, remove Google Sheets integration or implement proper OAuth flow.');
};