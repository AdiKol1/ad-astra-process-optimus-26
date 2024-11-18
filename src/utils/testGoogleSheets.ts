import { saveFormDataToSheet, validateGoogleSheetsConfig } from './googleSheets';

export const testGoogleSheetsIntegration = async () => {
  try {
    // First validate the configuration
    await validateGoogleSheetsConfig();
    
    const mockFormData = {
      name: 'Test User',
      email: 'test@example.com',
      phone: '555-0123',
      employees: '50',
      processVolume: '100-500',
      industry: 'small_business',
      timelineExpectation: '3_months',
      message: 'Test submission'
    };

    const result = await saveFormDataToSheet(mockFormData);
    console.log('Google Sheets test successful:', result);
    return result;
  } catch (error) {
    console.error('Google Sheets test failed:', error);
    throw error;
  }
};