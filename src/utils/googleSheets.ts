export const saveFormDataToSheet = async (formData: any, results?: any) => {
  const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
  const SHEET_ID = import.meta.env.VITE_GOOGLE_SHEET_ID;
  const SHEET_NAME = 'Ad Astra Leads';
  
  if (!API_KEY || !SHEET_ID) {
    throw new Error('Google Sheets API configuration is missing');
  }

  // Validate required form data
  if (!formData) {
    throw new Error('Form data is required');
  }

  const values = [
    [
      formData.name || '',
      formData.email || '',
      formData.phone || '',
      formData.industry || '',
      formData.employees || '',
      formData.processVolume || '',
      formData.timelineExpectation || '',
      formData.message || '',
      new Date().toISOString(),
      results ? JSON.stringify(results) : ''
    ]
  ];

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_NAME}!A:J:append?valueInputOption=RAW&key=${API_KEY}`;
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: values
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Google Sheets API Error Response:', errorData);
      throw new Error(`Google Sheets API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error saving to Google Sheets:', error);
    throw error;
  }
};

export const validateGoogleSheetsConfig = async () => {
  const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
  const SHEET_ID = import.meta.env.VITE_GOOGLE_SHEET_ID;

  if (!API_KEY || !SHEET_ID) {
    throw new Error('Google Sheets configuration is missing');
  }

  try {
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}?key=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error('Failed to validate Google Sheets configuration');
    }

    return true;
  } catch (error) {
    console.error('Google Sheets validation error:', error);
    throw error;
  }
};