import { BlogPost } from '@/types/blog';
import { miamiTechGuide } from './miami-tech-guide';
import { constructionAutomationGuide } from './construction-automation';

export const techAutomationPosts: BlogPost[] = [
  constructionAutomationGuide,
  miamiTechGuide
];

export default techAutomationPosts;