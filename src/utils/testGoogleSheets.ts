import { saveFormDataToSheet } from './googleSheets';

export const testGoogleSheetsIntegration = async () => {
  console.log('Starting Google Sheets integration test...');
  
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

  try {
    console.log('Attempting to save mock data to Google Sheets...');
    console.log('Mock form data:', mockFormData);
    
    const result = await saveFormDataToSheet(mockFormData);
    console.log('Google Sheets API Response:', result);
    return result;
  } catch (error) {
    console.error('Google Sheets test failed:', error);
    throw error;
  }
};

// Run the test
console.log('Executing Google Sheets integration test...');
testGoogleSheetsIntegration().catch(error => {
  console.error('Test execution failed:', error);
});