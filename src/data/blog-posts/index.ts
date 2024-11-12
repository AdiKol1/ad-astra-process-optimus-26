import { BlogPost } from '@/types/blog';
import { techAutomationPosts } from './tech-automation';
import { marketingPosts } from './marketing';
import { aiTrendsPosts } from './ai-trends';

// Combine all posts and sort by date
export const blogPosts: BlogPost[] = [
  ...techAutomationPosts,
  ...marketingPosts,
  ...aiTrendsPosts
].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

// Export posts by category for easier filtering
export const postsByCategory = {
  'Tech Automation': techAutomationPosts,
  'Marketing': marketingPosts,
  'AI Trends': aiTrendsPosts
};

export default blogPosts;