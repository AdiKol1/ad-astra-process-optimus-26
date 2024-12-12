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
  projectedRevenue: number;
  conversionImprovement: number;
}

interface CACResponses {
  industry: string;
  marketing_spend: string;
  new_customers: string;
  manualProcesses: string[];
  toolStack: string[];
}

export const generateCACResults = (responses: CACResponses): CACMetrics => {
  console.log('Generating CAC results with responses:', responses);
  
  const industry = responses.industry || 'Other';
  const standards = getIndustryStandards(industry);
  
  // Calculate base CAC with industry standards
  const baseSpend = SPEND_RANGES[responses.marketing_spend || "Less than $1,000"];
  const monthlyCustomers = CUSTOMER_VOLUME_MULTIPLIERS[responses.new_customers || "1-5 customers"];
  const industryFactor = standards.baseCAC / 1000;
  const currentCAC = Math.round((baseSpend / monthlyCustomers) * industryFactor);

  // Calculate potential reduction with industry-specific factors
  const hasManualProcesses = (responses.manualProcesses?.length || 0) > 2;
  const usesBasicTools = responses.toolStack?.includes("Spreadsheets/Manual tracking") || false;
  const hasAdvancedTools = responses.toolStack?.some(tool => 
    ["CRM", "Marketing Automation", "Analytics Platform"].includes(tool)
  ) || false;

  // Enhanced reduction calculation
  const baseReduction = standards.baseReduction;
  const toolImpact = hasAdvancedTools ? 0.15 : (usesBasicTools ? 0.05 : 0);
  const processImpact = hasManualProcesses ? -0.10 : 0.10;
  
  const potentialReduction = Math.min(
    baseReduction + toolImpact + processImpact,
    0.45 // Cap at 45%
  );

  // Calculate annual savings with volume considerations
  const annualCustomers = monthlyCustomers * 12;
  const annualSavings = Math.round(currentCAC * potentialReduction * annualCustomers);

  // Calculate revenue impact
  const annualSpend = baseSpend * 12;
  const automationLevel = hasAdvancedTools ? 0.45 : (hasManualProcesses ? 0.25 : 0.35);
  const revenueMultiplier = standards.revenueMultiplier;
  const projectedRevenue = Math.round(annualSpend * (revenueMultiplier - 1) * automationLevel);

  // Calculate ROI with dynamic implementation cost
  const baseImplementationCost = 25000;
  const complexityMultiplier = hasManualProcesses ? 1.2 : 1;
  const scaleMultiplier = monthlyCustomers > 10 ? 1.3 : 1;
  const implementationCost = Math.round(baseImplementationCost * complexityMultiplier * scaleMultiplier);
  
  const totalBenefit = annualSavings + projectedRevenue;
  const automationROI = Math.min(Math.round((totalBenefit / implementationCost) * 100), 300);

  // Calculate conversion improvement
  const baseConversion = INDUSTRY_CAC_STANDARDS[industry]?.baseConversion || 0.02; // 2% base
  const toolMultiplier = hasAdvancedTools ? 2 : (usesBasicTools ? 1.2 : 1);
  const processMultiplier = hasManualProcesses ? 0.8 : 1.5;
  const volumeMultiplier = monthlyCustomers > 10 ? 1.3 : 1;
  
  const conversionImprovement = Math.min(
    Math.round((baseConversion * toolMultiplier * processMultiplier * volumeMultiplier - baseConversion) * 100),
    50 // Cap at 50%
  );

  const results = {
    currentCAC,
    potentialReduction,
    annualSavings,
    automationROI,
    projectedRevenue,
    conversionImprovement
  };

  console.log('Generated CAC metrics:', results);
  return results;
};