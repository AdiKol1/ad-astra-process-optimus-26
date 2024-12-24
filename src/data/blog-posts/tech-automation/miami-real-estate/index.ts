import { BlogPost } from '@/types/blog';
import { overview } from './sections/overview';
import { challenges } from './sections/challenges';
import { tools } from './sections/tools';
import { implementation } from './sections/implementation';
import { costs } from './sections/costs';
import { neighborhoods } from './sections/neighborhoods';
import { metrics } from './sections/metrics';
import { marketing } from './sections/marketing';
import { resources } from './sections/resources';

export const miamiRealEstateAutomation: BlogPost = {
  id: "miami-real-estate-automation-2024",
  title: "Miami Real Estate Agents: Your Guide to AI-Powered Sales Automation [2024 Edition]",
  slug: "miami-real-estate-automation-2024",
  excerpt: "Discover how Miami's top-performing real estate agents are using AI automation to increase sales and save time. Complete implementation guide for agents in Miami-Dade, Brickell, Coral Gables, and surrounding areas.",
  content: `${overview}${challenges}${tools}${implementation}${costs}${neighborhoods}${metrics}${marketing}${resources}`,
  image: "https://images.unsplash.com/photo-1582407947304-fd86f028f716",
  date: "April 2, 2024",
  category: "Regional Trends",
  author: "Ad Astra Team",
  readTime: "15 min read",
  tags: [
    "Miami Real Estate",
    "AI Automation",
    "Sales Technology",
    "Real Estate Tech",
    "Miami-Dade",
    "Brickell",
    "Coral Gables",
    "Property Tech"
  ]
};

export default miamiRealEstateAutomation;