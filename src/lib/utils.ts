import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(Math.max(0, value));
};

export const formatPercentage = (value: number): string => {
  return Math.max(0, Math.min(100, value)).toFixed(1) + '%';
};

export const formatHours = (value: number): string => {
  return Math.max(0, Math.round(value)).toLocaleString() + ' hours';
};

export const formatNumber = (value: number): string => {
  return Math.max(0, value).toLocaleString();
};