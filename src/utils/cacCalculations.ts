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

export const calculateAutomationImpact = (cac: number): number => {
  if (cac < 100) return 0.15;
  if (cac < 500) return 0.25;
  return 0.35;
};

export const generateCACResults = (responses: Record<string, any>): CACMetrics => {
  const cac = calculateCAC(
    responses.marketing_spend || "Less than $1,000",
    responses.new_customers || "1-5 customers"
  );
  
  const reduction = calculateAutomationImpact(cac);
  const monthlyCustomers = CUSTOMER_RANGES[responses.new_customers || "1-5 customers"];
  
  return {
    currentCAC: Math.round(cac),
    potentialReduction: reduction,
    annualSavings: Math.round(cac * reduction * monthlyCustomers * 12),
    automationROI: Number((cac * reduction * monthlyCustomers * 12 / 25000).toFixed(2))
  };
};