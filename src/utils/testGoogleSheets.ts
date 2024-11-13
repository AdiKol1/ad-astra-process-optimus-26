import { saveFormDataToSheet } from './googleSheets';

// Test function to verify Google Sheets integration
export const testGoogleSheetsIntegration = async () => {
  const mockFormData = {
    name: 'Test User',
    email: 'test@example.com',
    phone: '555-0123',
    industry: 'Technology',
    timelineExpectation: '3_months',
    employees: '50',
    processVolume: '1000'
  };

  const mockAssessmentResults = {
    results: {
      annual: {
        savings: 50000
      }
    }
  };

  console.log('Starting test with mock data:', mockFormData);
  const result = await saveFormDataToSheet(mockFormData, mockAssessmentResults);
  console.log('Test result:', result);
  return result;
};

// Run the test
testGoogleSheetsIntegration().catch(console.error);