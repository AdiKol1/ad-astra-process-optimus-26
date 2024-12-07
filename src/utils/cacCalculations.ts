import { INDUSTRY_CAC_STANDARDS, CUSTOMER_VOLUME_MULTIPLIERS, SPEND_RANGES } from './cac/industryStandards';
import { calculateRevenueGrowth, calculateROI } from './cac/revenueProjections';
import { calculateConversionImprovement } from './cac/conversionMetrics';

export interface CACMetrics {
  currentCAC: number;
  potentialReduction: number;
  annualSavings: number;
  automationROI: number;
  projectedRevenue?: number;
  conversionImprovement?: number;
}

export const generateCACResults = (responses: Record<string, any>): CACMetrics => {
  const industry = responses.industry || 'Other';
  const standards = INDUSTRY_CAC_STANDARDS[industry] || INDUSTRY_CAC_STANDARDS.Other;
  
  // Calculate base CAC
  const spend = SPEND_RANGES[responses.marketing_spend || "Less than $1,000"];
  const customers = CUSTOMER_VOLUME_MULTIPLIERS[responses.new_customers || "1-5 customers"];
  const currentCAC = spend / customers;

  // Calculate potential reduction
  const hasManualProcesses = responses.manualProcesses?.length > 3;
  const usesBasicTools = responses.toolStack?.includes("Spreadsheets/Manual tracking");
  
  let potentialReduction = standards.baseReduction;
  if (hasManualProcesses) potentialReduction += standards.processImpact;
  if (usesBasicTools) potentialReduction += standards.toolImpact;

  // Calculate annual savings
  const monthlyCustomers = CUSTOMER_VOLUME_MULTIPLIERS[responses.new_customers || "1-5 customers"];
  const annualSavings = Math.round(currentCAC * potentialReduction * monthlyCustomers * 12);

  // Calculate revenue growth potential
  const currentRevenue = spend * 12; // Estimate annual revenue from marketing spend
  const automationLevel = hasManualProcesses ? 20 : 40; // Basic automation level estimate
  const projectedRevenue = calculateRevenueGrowth({
    industry,
    currentRevenue,
    automationLevel
  });

  // Calculate ROI including both savings and revenue growth
  const implementationCost = 25000; // Base implementation cost
  const automationROI = calculateROI(annualSavings, projectedRevenue, implementationCost);

  // Calculate conversion improvement
  const toolsModernity = usesBasicTools ? 30 : 70;
  const conversionImprovement = calculateConversionImprovement({
    industry,
    currentRate: 0.05, // Assume 5% base conversion rate
    automationLevel,
    toolsModernity
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