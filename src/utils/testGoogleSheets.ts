import { saveFormDataToSheet } from './googleSheets';

export const testGoogleSheetsIntegration = async () => {
  console.log('Starting Google Sheets integration test...');
  
  const mockFormData = {
    name: 'Test User',
    email: 'test@example.com',
    phone: '555-0123',
    employees: '50',
    processVolume: '100-500',
    industry: 'Technology',
    timelineExpectation: '1-3 months',
    message: 'Test submission'
  };

  try {
    console.log('Mock form data:', mockFormData);
    const result = await saveFormDataToSheet(mockFormData);
    console.log('Test completed successfully:', result);
    return result;
  } catch (error) {
    console.error('Test failed:', error);
    throw error;
  }
};

// Run the test
testGoogleSheetsIntegration().catch(error => {
  console.error('Test execution failed:', error);
});