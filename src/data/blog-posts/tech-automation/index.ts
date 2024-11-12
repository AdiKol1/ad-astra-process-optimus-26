import { miamiTechGuide } from './miami-tech-guide';
import { logisticsAutomation } from './logistics-automation';
import { businessAutomationGuide } from './business-automation-guide';
import { marketAnalysis2024 } from './market-analysis-2024';
import { solutionComparison2024 } from './solution-comparison-2024';

export const techAutomationPosts: BlogPost[] = [
  solutionComparison2024,
  marketAnalysis2024,
  businessAutomationGuide,
  logisticsAutomation,
  miamiTechGuide
].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());