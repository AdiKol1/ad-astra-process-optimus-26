import { BlogPost } from '@/types/blog';
import { miamiAIReport } from './miami-ai-report';
import { fortLauderdaleGuide } from './fort-lauderdale-guide';
import { palmBeachTrends } from './palm-beach-trends';
import { miamiRealEstateAI } from './miami-real-estate-ai';
import { miamiRealEstateAutomation } from './miami-real-estate-automation';

export const regionalTrendsPosts: BlogPost[] = [
  miamiRealEstateAutomation,
  miamiRealEstateAI,
  miamiAIReport,
  fortLauderdaleGuide,
  palmBeachTrends
];

export default regionalTrendsPosts;