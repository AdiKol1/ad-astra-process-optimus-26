// Test function to verify Google Sheets integration
export const testGoogleSheetsIntegration = async () => {
  const mockFormData = {
    name: 'Test User',
    email: 'test@example.com',
    phone: '555-0123',
    industry: 'Technology',
    timelineExpectation: '3_months'
  };

  const mockAssessmentResults = {
    results: {
      annual: {
        savings: 50000
      }
    }
  };

  const result = await saveFormDataToSheet(mockFormData, mockAssessmentResults);
  console.log('Test result:', result);
  return result;
};