import { 
  INDUSTRY_CAC_STANDARDS, 
  CUSTOMER_VOLUME_MULTIPLIERS, 
  SPEND_RANGES,
  getIndustryStandards,
  calculateBaseReduction,
  calculateToolImpact
} from './cac/industryStandards';

export interface CACMetrics {
  currentCAC: number;
  potentialReduction: number;
  annualSavings: number;
  automationROI: number;
  projectedRevenue?: number;
  conversionImprovement?: number;
}

export const generateCACResults = (responses: Record<string, any>): CACMetrics => {
  console.log('Generating CAC results with responses:', responses);
  
  const industry = responses.industry || 'Other';
  const standards = getIndustryStandards(industry);
  
  // Calculate base CAC with volume considerations
  const spend = SPEND_RANGES[responses.marketing_spend || "Less than $1,000"];
  const customers = CUSTOMER_VOLUME_MULTIPLIERS[responses.new_customers || "1-5 customers"];
  const currentCAC = spend / customers;

  // Enhanced reduction calculation
  const hasManualProcesses = responses.manualProcesses?.length > 3;
  const usesBasicTools = responses.toolStack?.includes("Spreadsheets/Manual tracking");
  
  // Calculate potential reduction with new factors
  const baseReduction = calculateBaseReduction(industry, !hasManualProcesses);
  const toolImpact = calculateToolImpact(industry, !usesBasicTools);
  const processImpact = hasManualProcesses ? standards.processImpact : 0;
  
  const potentialReduction = Math.min(
    baseReduction + toolImpact + processImpact,
    0.50 // Cap at 50% reduction
  );

  // Calculate annual savings with volume scaling
  const monthlyCustomers = CUSTOMER_VOLUME_MULTIPLIERS[responses.new_customers || "1-5 customers"];
  const annualSavings = Math.round(currentCAC * potentialReduction * monthlyCustomers * 12);

  // Enhanced revenue growth calculation
  const currentRevenue = spend * 12;
  const automationLevel = hasManualProcesses ? 20 : 40;
  const revenueMultiplier = standards.revenueMultiplier || 1.25;
  const projectedRevenue = Math.round(currentRevenue * (revenueMultiplier - 1) * (automationLevel / 100));

  // Calculate ROI including both savings and revenue growth
  const implementationCost = 25000; // Base implementation cost
  const totalBenefit = annualSavings + projectedRevenue;
  const automationROI = Math.min(Math.round((totalBenefit / implementationCost) * 100), 300);

  // Calculate conversion improvement with new base rates
  const toolsModernity = usesBasicTools ? 30 : 70;
  const conversionBase = standards.conversionBase || 0.20;
  const conversionImprovement = Math.round(
    conversionBase * (automationLevel / 100) * (toolsModernity / 100) * 100
  );

  console.log('Generated CAC metrics:', {
    currentCAC,
    potentialReduction,
    annualSavings,
    automationROI,
    projectedRevenue,
    conversionImprovement
  });

  return {
    currentCAC: Math.round(currentCAC),
    potentialReduction,
    annualSavings,
    automationROI,
    projectedRevenue,
    conversionImprovement
  };
};