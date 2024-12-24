import { BlogPost } from '@/types/blog';
import { introduction } from './sections/introduction';
import { marketOverview } from './sections/market-overview';
import { solutions } from './sections/solutions';
import { implementation } from './sections/implementation';
import { roiAnalysis } from './sections/roi-analysis';
import { support } from './sections/support';
import { challenges } from './sections/challenges';

export const smallBusinessAutomation: BlogPost = {
  id: "small-business-automation-2024",
  title: "Small Business Automation Guide: South Florida Edition [2024 Complete Guide]",
  slug: "small-business-automation-guide-south-florida-2024",
  excerpt: "Ultimate guide to business automation for South Florida small businesses. Learn how Miami-Dade, Broward, and Palm Beach County businesses are using affordable automation to grow faster and reduce costs.",
  content: `${introduction}${marketOverview}${solutions}${implementation}${roiAnalysis}${support}${challenges}`,
  image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
  date: "April 15, 2024",
  category: "Tech Automation",
  author: "Ad Astra Team",
  readTime: "15 min read",
  tags: [
    "Small Business",
    "Business Automation",
    "South Florida",
    "Implementation Guide",
    "ROI Analysis",
    "Miami-Dade",
    "Broward",
    "Palm Beach"
  ]
};

export default smallBusinessAutomation;