import { GoogleSpreadsheet } from 'google-spreadsheet';
import type { AuditFormData, AssessmentResults } from '@/types/assessment';

// Initialize the sheet
const initializeSheet = async () => {
  const SHEET_ID = import.meta.env.VITE_GOOGLE_SHEET_ID;
  const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

  if (!SHEET_ID || !API_KEY) {
    throw new Error('Missing required environment variables for Google Sheets integration');
  }

  try {
    const doc = new GoogleSpreadsheet(SHEET_ID, {
      apiKey: API_KEY
    });
    
    await doc.loadInfo();
    return doc;
  } catch (error) {
    console.error('Error initializing Google Sheet:', error);
    throw new Error('Failed to initialize Google Sheets connection');
  }
};

export const saveFormDataToSheet = async (
  formData: AuditFormData,
  assessmentResults?: AssessmentResults
) => {
  try {
    const doc = await initializeSheet();
    const sheet = doc.sheetsByIndex[0];

    if (!sheet) {
      throw new Error('No sheet found in the specified Google Spreadsheet');
    }

    // Calculate estimated value based on assessment results
    const estValue = assessmentResults?.results?.annual?.savings || 0;
    
    // Calculate probability based on assessment score
    const probability = assessmentResults?.assessmentScore?.automationPotential || 0;
    
    // Generate notes from assessment insights
    const notes = generateAssessmentNotes(assessmentResults);

    // Add a new row with the comprehensive data
    await sheet.addRow({
      timestamp: new Date().toISOString(),
      opportunity_value: estValue,
      name: formData.name || '',
      email: formData.email || '',
      phone: formData.phone || '',
      industry: formData.industry || '',
      implementation_timeline: formData.timelineExpectation || '',
      stage: 'Prospect', // Initial stage for new leads
      est_value: `$${estValue.toLocaleString()}`,
      relationship_owner: 'Automated Lead', // Can be updated manually
      probability: `${Math.round(probability)}%`,
      notes: notes,
      // Additional assessment data
      employees: formData.employees,
      process_volume: formData.processVolume,
      automation_score: assessmentResults?.assessmentScore?.overall || 0,
      annual_hours_saved: assessmentResults?.results?.annual?.hours || 0,
      message: formData.message || '',
    });

    return true;
  } catch (error) {
    console.error('Error saving to Google Sheet:', error);
    throw new Error('Failed to save form data to Google Sheets');
  }
};

const generateAssessmentNotes = (results?: AssessmentResults): string => {
  if (!results) return '';

  const notes = [
    `Automation Potential: ${results.assessmentScore?.automationPotential}%`,
    `Annual Savings: $${results.results?.annual?.savings.toLocaleString()}`,
    `Hours Saved/Year: ${results.results?.annual?.hours}`,
  ];

  // Add recommendations if available
  if (results.recommendations?.recommendations) {
    notes.push('\nKey Recommendations:');
    results.recommendations.recommendations.forEach(rec => {
      notes.push(`- ${rec.title}: ${rec.description}`);
      notes.push(`  Impact: ${rec.impact}, Timeframe: ${rec.timeframe}`);
      notes.push(`  Benefits: ${rec.benefits.join(', ')}`);
    });
  }

  // Add industry analysis if available
  if (results.industryAnalysis) {
    notes.push('\nIndustry Analysis:');
    notes.push(`Avg Processing Time: ${results.industryAnalysis.benchmarks.averageProcessingTime}`);
    notes.push(`Error Rates: ${results.industryAnalysis.benchmarks.errorRates}`);
    notes.push(`Automation Level: ${results.industryAnalysis.benchmarks.automationLevel}`);
  }

  return notes.join('\n');
};