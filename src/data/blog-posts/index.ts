import { BlogPost } from '@/types/blog';
import { techAutomationPosts } from './tech-automation';
import { marketingPosts } from './marketing';
import { aiTrendsPosts } from './ai-trends';
import { tourismPosts } from './tourism';

// Combine all posts and sort by date
export const blogPosts: BlogPost[] = [
  ...techAutomationPosts,
  ...marketingPosts,
  ...aiTrendsPosts,
  ...tourismPosts
].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

// Export posts by category for easier filtering
export const postsByCategory = {
  'Tech Automation': techAutomationPosts,
  'Marketing': marketingPosts,
  'AI Trends': aiTrendsPosts,
  'Tourism Tech': tourismPosts
};

export default blogPosts;