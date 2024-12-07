export interface CACMetrics {
  currentCAC: number;
  potentialReduction: number;
  annualSavings: number;
  automationROI: number;
}

const SPEND_RANGES: Record<string, number> = {
  "Less than $1,000": 500,
  "$1,000 - $5,000": 3000,
  "$5,000 - $20,000": 12500,
  "More than $20,000": 25000
};

const CUSTOMER_RANGES: Record<string, number> = {
  "1-5 customers": 3,
  "6-20 customers": 13,
  "21-50 customers": 35,
  "More than 50": 60
};

export const calculateCAC = (spend: string, customers: string): number => {
  const avgSpend = SPEND_RANGES[spend] || 3000;
  const avgCustomers = CUSTOMER_RANGES[customers] || 13;
  return avgSpend / avgCustomers;
};

// Updated to provide more significant impact based on industry standards
export const calculateAutomationImpact = (cac: number): number => {
  // Higher CAC = Higher potential reduction
  if (cac < 100) return 0.20; // Increased from 0.15
  if (cac < 500) return 0.30; // Increased from 0.25
  return 0.40; // Increased from 0.35
};

export const generateCACResults = (responses: Record<string, any>): CACMetrics => {
  const cac = calculateCAC(
    responses.marketing_spend || "Less than $1,000",
    responses.new_customers || "1-5 customers"
  );
  
  // Calculate reduction based on multiple factors
  const baseReduction = calculateAutomationImpact(cac);
  
  // Adjust based on current tools and processes
  const hasManualProcesses = responses.manualProcesses?.length > 3;
  const usesBasicTools = responses.toolStack?.includes("Spreadsheets/Manual tracking");
  
  let adjustedReduction = baseReduction;
  if (hasManualProcesses) adjustedReduction += 0.05;
  if (usesBasicTools) adjustedReduction += 0.05;
  
  // Calculate monthly customers for annual projections
  const monthlyCustomers = CUSTOMER_RANGES[responses.new_customers || "1-5 customers"];
  
  // Calculate annual savings with the adjusted reduction
  const annualSavings = Math.round(cac * adjustedReduction * monthlyCustomers * 12);
  
  // Calculate ROI based on industry standards and potential
  const implementationCost = 25000; // Base implementation cost
  const roi = Number((annualSavings / implementationCost).toFixed(2));
  
  return {
    currentCAC: Math.round(cac),
    potentialReduction: adjustedReduction,
    annualSavings: annualSavings,
    automationROI: roi
  };
};