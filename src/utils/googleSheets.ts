export const saveFormDataToSheet = async (formData: any, results?: any) => {
  const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
  const SHEET_ID = import.meta.env.VITE_GOOGLE_SHEET_ID;
  const SHEET_NAME = 'Ad Astra Leads';
  
  console.log('Google Sheets API Configuration:');
  console.log('Sheet ID:', SHEET_ID);
  console.log('Sheet Name:', SHEET_NAME);

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

  console.log('Formatted data for Google Sheets:', values);

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_NAME}!A:J:append?valueInputOption=RAW&key=${API_KEY}`;
  
  try {
    console.log('Sending request to Google Sheets API...');
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
    console.log('Successfully saved to Google Sheets:', data);
    return data;
  } catch (error) {
    console.error('Error saving to Google Sheets:', error);
    throw error;
  }
};