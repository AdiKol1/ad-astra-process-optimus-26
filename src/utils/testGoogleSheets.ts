import { saveFormDataToSheet } from './googleSheets';
import type { AuditFormData } from '@/types/assessment';

export const testGoogleSheetsIntegration = async () => {
  console.log('Starting Google Sheets integration test...');
  
  const mockFormData: AuditFormData = {
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
    console.log('Attempting to save mock data:', mockFormData);
    const result = await saveFormDataToSheet(mockFormData);
    console.log('Save result:', result);
    return result;
  } catch (error) {
    console.error('Error during Google Sheets test:', error);
    throw error;
  }
};

// Run the test
testGoogleSheetsIntegration().catch(error => {
  console.error('Test failed:', error);
});