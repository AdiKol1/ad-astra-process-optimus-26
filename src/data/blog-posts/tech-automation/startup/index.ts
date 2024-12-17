import { introduction } from './sections/introduction';
import { landscape } from './sections/landscape';
import { solutions } from './sections/solutions';
import { implementation } from './sections/implementation';
import { successStories } from './sections/success-stories';
import { roi } from './sections/roi';
import { resources } from './sections/resources';
import type { BlogPost } from '@/types/blog';

export const startupAutomationGuide: BlogPost = {
  id: "startup-automation-2024",
  title: "Affordable Automation Solutions for South Florida Startups [2024 Guide]",
  slug: "affordable-automation-solutions-south-florida-startups-2024",
  excerpt: "Discover budget-friendly automation solutions for Miami, Fort Lauderdale, and Palm Beach startups. Learn how South Florida's most innovative startups are using automation to scale rapidly while keeping costs low.",
  content: `${introduction}${landscape}${solutions}${implementation}${successStories}${roi}${resources}`,
  image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd",
  date: "April 15, 2024",
  category: "Tech Automation",
  author: "Ad Astra Team",
  readTime: "15 min read",
  tags: [
    "Startup Automation",
    "South Florida Tech",
    "Business Efficiency",
    "Startup Guide",
    "Miami Startups",
    "Fort Lauderdale Startups",
    "Palm Beach Startups"
  ]
};

export default startupAutomationGuide;