export const BLOG_CATEGORIES = [
  'Tech Automation',
  'Marketing',
  'AI Trends',
  'Tourism Tech'
] as const;

export type BlogCategory = typeof BLOG_CATEGORIES[number];