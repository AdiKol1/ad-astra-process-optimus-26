import { BlogPost } from '@/types/blog';
import { constructionAutomationGuide } from './construction-automation';
import { healthcareAutomation } from './healthcare-automation';
import { miamiTechGuide } from './miami-tech-guide';

export const techAutomationPosts: BlogPost[] = [
  healthcareAutomation,
  constructionAutomationGuide,
  miamiTechGuide
];

export default techAutomationPosts;