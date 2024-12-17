import { BlogPost } from '@/types/blog';
import { introduction } from './introduction';
import { implementation } from './implementation';
import { costAnalysis } from './cost-analysis';
import { specialtySolutions } from './specialty-solutions';
import { compliance } from './compliance';
import { successMetrics } from './success-metrics';
import { futureAndResources } from './future-and-resources';

export const healthcareAutomation: BlogPost = {
  id: "south-florida-healthcare-automation-2024",
  title: "South Florida Medical Practices: A Guide to Healthcare Automation [2024 Edition]",
  slug: "south-florida-healthcare-automation-guide-2024",
  excerpt: "Discover how South Florida medical practices are using automation to improve patient care, reduce costs, and increase efficiency. Complete implementation guide for healthcare providers in Miami-Dade, Broward, and Palm Beach counties.",
  content: `${introduction}\n${implementation}\n${costAnalysis}\n${specialtySolutions}\n${compliance}\n${successMetrics}\n${futureAndResources}`,
  image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
  date: "March 29, 2024",
  category: "Tech Automation",
  author: "Ad Astra Team",
  readTime: "15 min read",
  tags: [
    "Healthcare Automation",
    "Medical Technology",
    "Practice Management",
    "Healthcare Tech",
    "South Florida Healthcare",
    "Medical Automation",
    "Patient Care",
    "Healthcare Efficiency"
  ]
};