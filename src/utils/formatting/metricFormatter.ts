export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

export const formatPercentage = (value: number): string => {
  return `${Math.round(value)}%`;
};

export const formatHours = (hours: number): string => {
  return `${Math.round(hours).toLocaleString()}h`;
};

export const formatMetric = (value: number, type: 'currency' | 'percentage' | 'hours'): string => {
  switch (type) {
    case 'currency':
      return formatCurrency(value);
    case 'percentage':
      return formatPercentage(value);
    case 'hours':
      return formatHours(value);
    default:
      return String(value);
  }
};