import { BlogPost } from '@/types/blog';
import { constructionAutomation } from './construction-automation';
import { healthcareAutomation } from './healthcare-automation';
import { miamiTechGuide } from './miami-tech-guide';

export const techAutomationPosts: BlogPost[] = [
  healthcareAutomation,
  constructionAutomation,
  miamiTechGuide
];

export default techAutomationPosts;