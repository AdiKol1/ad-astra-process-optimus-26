import { BlogPost } from '@/types/blog';
import { constructionAutomationPost } from './construction';
import { miamiTechAutomation2024 } from './miami-tech-2024';
import { southFloridaComparison } from './south-florida-comparison';
import { logisticsAutomation } from './logistics-automation';
import { businessAutomationGuide } from './business-automation-guide';
import { marketAnalysis2024 } from './market-analysis-2024';
import { solutionComparison2024 } from './solution-comparison-2024';
import { futureAutomation2025 } from './future-automation-2025';
import { healthcareAutomation } from './healthcare';
import { smallBusinessAutomation } from './small-business';
import { startupAutomationGuide } from './startup';

export const techAutomationPosts: BlogPost[] = [
  startupAutomationGuide,
  smallBusinessAutomation,
  healthcareAutomation,
  constructionAutomationPost,
  miamiTechAutomation2024,
  southFloridaComparison,
  solutionComparison2024,
  marketAnalysis2024,
  businessAutomationGuide,
  logisticsAutomation,
  futureAutomation2025
].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());