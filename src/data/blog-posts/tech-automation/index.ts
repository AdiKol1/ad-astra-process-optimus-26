import { BlogPost } from '@/types/blog';
import { constructionAutomationGuide } from './construction-automation';
import { healthcareAutomation } from './healthcare-automation';
import { miamiTechGuide } from './miami-tech-guide';
import { smallBusinessGuide } from './small-business-guide';
import { startupAutomationGuide } from './startup-automation-guide';

export const techAutomationPosts: BlogPost[] = [
  healthcareAutomation,
  constructionAutomationGuide,
  miamiTechGuide,
  smallBusinessGuide,
  startupAutomationGuide
];

export default techAutomationPosts;