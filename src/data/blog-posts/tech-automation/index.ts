import { BlogPost } from '@/types/blog';
import { southFloridaComparison } from './south-florida-comparison';
import { miamiTechGuide } from './miami-tech-guide';
import { logisticsAutomation } from './logistics-automation';
import { businessAutomationGuide } from './business-automation-guide';
import { marketAnalysis2024 } from './market-analysis-2024';
import { solutionComparison2024 } from './solution-comparison-2024';
import { futureAutomation2025 } from './future-automation-2025';
import { southFloridaCostReduction } from './south-florida-cost-reduction';

export const techAutomationPosts: BlogPost[] = [
  southFloridaCostReduction,
  futureAutomation2025,
  southFloridaComparison,
  solutionComparison2024,
  marketAnalysis2024,
  businessAutomationGuide,
  logisticsAutomation,
  miamiTechGuide
].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());