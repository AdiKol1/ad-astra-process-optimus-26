import { BlogPost } from '@/types/blog';
import { miamiAiAdoption } from './miami-ai-adoption';
import { fortLauderdaleGuide } from './fort-lauderdale-guide';
import { palmBeachTrends } from './palm-beach-trends';

export const regionalTrendsPosts: BlogPost[] = [
  miamiAiAdoption,
  fortLauderdaleGuide,
  palmBeachTrends
].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

export default regionalTrendsPosts;