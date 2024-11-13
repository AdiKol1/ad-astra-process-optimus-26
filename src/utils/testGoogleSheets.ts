import { saveFormDataToSheet } from './googleSheets';

// Test function to verify Google Sheets integration
export const testGoogleSheetsIntegration = async () => {
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

  const mockAssessmentResults = {
    results: {
      annual: {
        savings: 50000,
        hours: 2080
      }
    },
    assessmentScore: {
      overall: 85,
      automationPotential: 75
    }
  };

  console.log('Starting test with mock data:', mockFormData);
  
  try {
    const result = await saveFormDataToSheet(mockFormData, mockAssessmentResults);
    console.log('Test result:', result);
    return result;
  } catch (error) {
    console.error('Test failed:', error);
    throw error;
  }
};

// Run the test
testGoogleSheetsIntegration().catch(console.error);