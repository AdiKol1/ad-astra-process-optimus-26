import { BlogPost } from '@/types/blog';
import { healthcareAutomation } from './healthcare-automation';
import { adminCosts } from './admin-costs';

export const healthcarePosts: BlogPost[] = [
  adminCosts,
  healthcareAutomation
].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

export default healthcarePosts;