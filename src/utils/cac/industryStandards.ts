export const INDUSTRY_CAC_STANDARDS = {
  'Healthcare': {
    baseReduction: 0.35, // 35% base reduction potential
    toolImpact: 0.15,    // Additional 15% for modern tools
    processImpact: 0.20  // Additional 20% for automated processes
  },
  'Financial Services': {
    baseReduction: 0.30,
    toolImpact: 0.12,
    processImpact: 0.18
  },
  'Technology': {
    baseReduction: 0.25,
    toolImpact: 0.10,
    processImpact: 0.15
  },
  'Other': {
    baseReduction: 0.20,
    toolImpact: 0.08,
    processImpact: 0.12
  }
};

export const CUSTOMER_VOLUME_MULTIPLIERS = {
  "1-5 customers": 3,
  "6-20 customers": 13,
  "21-50 customers": 35,
  "More than 50": 60
};

export const SPEND_RANGES = {
  "Less than $1,000": 500,
  "$1,000 - $5,000": 3000,
  "$5,000 - $20,000": 12500,
  "More than $20,000": 25000
};