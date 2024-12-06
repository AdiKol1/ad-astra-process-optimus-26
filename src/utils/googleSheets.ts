export const saveFormDataToSheet = async (formData: any) => {
  const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
  const SHEET_ID = import.meta.env.VITE_GOOGLE_SHEET_ID;
  
  // Add debug logs
  console.log('Checking environment variables:');
  console.log('API_KEY exists:', !!API_KEY);
  console.log('SHEET_ID exists:', !!SHEET_ID);
  
  if (!API_KEY || !SHEET_ID) {
    console.error('Missing Google Sheets configuration');
    throw new Error('Google Sheets configuration is missing');
  }

  const SHEET_NAME = 'Ad Astra Leads';
  
  // Format the data for the sheet
  const values = [
    [
      formData.firstName || '',
      formData.lastName || '',
      formData.email || '',
      formData.company || '',
      formData.role || '',
      formData.phoneNumber || '',
      new Date().toISOString(), // Timestamp
      'Lead Capture Form', // Source
      'New', // Status
    ]
  ];

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_NAME}!A:I:append?valueInputOption=RAW&key=${API_KEY}`;
  
  try {
    console.log('Attempting to save to Google Sheets:', { formData });
    
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
      console.error('Google Sheets API Error:', errorData);
      throw new Error(`Failed to save to Google Sheets: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Successfully saved to Google Sheets:', data);
    return data;
  } catch (error) {
    console.error('Error saving to Google Sheets:', error);
    throw error;
  }
};