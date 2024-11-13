const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const SHEET_ID = import.meta.env.VITE_GOOGLE_SHEET_ID;

// Save form data to Google Sheet
export const saveFormDataToSheet = async (formData?: any, assessmentResults?: any) => {
  if (!SHEET_ID) {
    console.error('Missing Google Sheet ID');
    throw new Error('Missing Google Sheet ID in environment variables');
  }

  if (!API_KEY) {
    console.error('Missing Google API Key');
    throw new Error('Missing Google API Key in environment variables');
  }

  try {
    console.log('Attempting to save data with:', {
      sheetId: SHEET_ID,
      hasApiKey: !!API_KEY,
      formData,
      assessmentResults
    });

    const values = [
      [
        new Date().toISOString(),
        formData?.industry || '',
        formData?.employees || '',
        formData?.processVolume || '',
        formData?.timelineExpectation || '',
        assessmentResults?.assessmentScore?.overall || '',
        assessmentResults?.assessmentScore?.automationPotential || '',
        assessmentResults?.results?.annual?.savings || '',
        assessmentResults?.results?.annual?.hours || '',
      ]
    ];

    console.log('Formatted values:', values);

    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Sheet1!A:I:append?valueInputOption=USER_ENTERED&key=${API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ values })
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Google Sheets API Error:', errorData);
      throw new Error(`Failed to save to Google Sheets: ${errorData.error?.message || 'Unknown error'}`);
    }

    const responseData = await response.json();
    console.log('Successfully saved to sheet:', responseData);

    return true;
  } catch (error: any) {
    console.error('Failed to save to sheet:', error);
    throw error;
  }
};