import { BlogPost } from '@/types/blog';
import { constructionAutomationPost } from './construction';
import { miamiTechAutomation2024 } from './miami-tech-2024';
import { southFloridaComparison } from './south-florida-comparison';
import { logisticsAutomation } from './logistics';
import { businessAutomationGuide } from './business-automation-guide';
import { marketAnalysis2024 } from './market-analysis-2024';
import { solutionComparison2024 } from './solution-comparison-2024';
import { futureTrends2025 } from './future-trends-2025';
import { healthcarePosts } from './healthcare';
import { smallBusinessAutomation } from './small-business';
import { startupAutomationGuide } from './startup';
import { roiAnalysis } from './roi-analysis';

export const techAutomationPosts: BlogPost[] = [
  ...healthcarePosts,
  futureTrends2025,
  solutionComparison2024,
  marketAnalysis2024,
  roiAnalysis,
  startupAutomationGuide,
  smallBusinessAutomation,
  constructionAutomationPost,
  miamiTechAutomation2024,
  southFloridaComparison,
  logisticsAutomation,
  businessAutomationGuide
].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());