const saveFormDataToSheet = async (
  formData?: any,
  assessmentResults?: any
) => {
  try {
    const SHEET_ID = import.meta.env.VITE_GOOGLE_SHEET_ID;
    const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

    if (!SHEET_ID || !API_KEY) {
      throw new Error('Missing required environment variables for Google Sheets integration');
    }

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

    const range = 'Sheet1!A:M'; // Adjust based on your sheet's structure
    const valueInputOption = 'USER_ENTERED';

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${range}:append?valueInputOption=${valueInputOption}&key=${API_KEY}`;

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
      throw new Error(`Failed to save to Google Sheets: ${errorData.error?.message || 'Unknown error'}`);
    }

    return true;
  } catch (error: any) {
    console.error('Failed to save to sheet:', error);
    throw error;
  }
};

export { saveFormDataToSheet };