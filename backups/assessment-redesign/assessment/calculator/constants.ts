export const WEIGHTS = {
  TEAM: 0.4,
  PROCESS: 0.4,
  CAC: 0.2
} as const;

export const ERROR_RATES = {
  'Less than 1%': 0.95,
  '1-2%': 0.85,
  '3-5%': 0.7,
  '6-10%': 0.5,
  'More than 10%': 0.3,
  'Not tracked': 0.4
} as const;

export const MODERN_TOOLS = [
  'Marketing automation platform',
  'AI/ML tools',
  'CRM system'
] as const;