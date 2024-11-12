import { BlogPost } from '@/types/blog';
import { miamiAIReport } from './miami-ai-report';
import { fortLauderdaleGuide } from './fort-lauderdale-guide';
import { palmBeachTrends } from './palm-beach-trends';
import { miamiRealEstateAI } from './miami-real-estate-ai';

export const regionalTrendsPosts: BlogPost[] = [
  miamiRealEstateAI,
  miamiAIReport,
  fortLauderdaleGuide,
  palmBeachTrends
];

export default regionalTrendsPosts;