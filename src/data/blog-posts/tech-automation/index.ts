import { BlogPost } from '@/types/blog';
import { miamiTechGuide } from './miami-tech-guide';
import { logisticsAutomation } from './logistics-automation';

export const techAutomationPosts: BlogPost[] = [
  logisticsAutomation,
  miamiTechGuide
].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

export default techAutomationPosts;