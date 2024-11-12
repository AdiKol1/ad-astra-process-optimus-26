import { BlogPost } from '@/types/blog';
import { techAutomationPosts } from './tech-automation';
import { regionalTrendsPosts } from './regional-trends';
import { marketingAutomationPosts } from './marketing-automation';
import { realEstatePosts } from './real-estate';

export const blogPosts: BlogPost[] = [
  ...techAutomationPosts,
  ...regionalTrendsPosts,
  ...marketingAutomationPosts,
  ...realEstatePosts
];

export default blogPosts;