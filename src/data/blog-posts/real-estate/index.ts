import { BlogPost } from '@/types/blog';
import { miamiAiStrategies } from './miami-ai-strategies';

export const realEstatePosts: BlogPost[] = [
  miamiAiStrategies
].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());