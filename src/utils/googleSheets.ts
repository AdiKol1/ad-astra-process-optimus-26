const SHEET_ID = import.meta.env.VITE_GOOGLE_SHEET_ID;
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

export const saveFormDataToSheet = async (formData?: any, assessmentResults?: any) => {
  if (!SHEET_ID) {
    console.error('Missing Google Sheet ID');
    return false;
  }

  try {
    // Format data to match spreadsheet columns
    const values = [
      [
        assessmentResults?.results?.annual?.savings || '',  // A: Opportunity Value
        formData?.name || '',                              // B: Name
        formData?.email || '',                            // C: Email
        formData?.phone || '',                            // D: Phone Number
        formData?.industry || '',                         // E: Industry
        formData?.timelineExpectation || '',             // F: Implementation Timeline
        'New Lead',                                      // G: Stage
        assessmentResults?.results?.annual?.savings || '' // H: Est. value
      ]
    ];

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Sheet1!A:H/append?valueInputOption=USER_ENTERED&key=${API_KEY}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ values })
    });

    if (!response.ok) {
      throw new Error(`Failed to save to Google Sheets: ${response.statusText}`);
    }

    return true;
  } catch (error) {
    console.error('Error saving to Google Sheets:', error);
    return false;
  }
};