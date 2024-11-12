import { BlogPost } from '@/types/blog';
import { aiTrendsPosts } from './ai-trends';
import { marketingPosts } from './marketing';

export const blogPosts: BlogPost[] = [
  ...aiTrendsPosts,
  ...marketingPosts
];

export default blogPosts;