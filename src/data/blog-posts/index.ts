import { BlogPost } from '@/types/blog';
import { techAutomationPosts } from './tech-automation';
import { regionalTrendsPosts } from './regional-trends';
import { marketingAutomationPosts } from './marketing-automation';

export const blogPosts: BlogPost[] = [
  ...techAutomationPosts,
  ...regionalTrendsPosts,
  ...marketingAutomationPosts
];

export default blogPosts;