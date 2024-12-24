import { BlogPost } from '@/types/blog';
import { introduction } from './sections/introduction';
import { marketPredictions } from './sections/market-predictions';
import { emergingTech } from './sections/emerging-tech';
import { industryTrends } from './sections/industry-trends';
import { workforceEvolution } from './sections/workforce';
import { infrastructure } from './sections/infrastructure';
import { investment } from './sections/investment';
import { recommendations } from './sections/recommendations';

export const futureTrends2025: BlogPost = {
  id: "future-automation-2025",
  title: "Future of Business Automation in South Florida: 2025 and Beyond",
  slug: "south-florida-future-automation-2025",
  excerpt: "Expert predictions on the future of business automation in South Florida. Key trends, opportunities, and strategic insights for Miami-Dade, Broward, and Palm Beach County businesses through 2025.",
  content: `${introduction}${marketPredictions}${emergingTech}${industryTrends}${workforceEvolution}${infrastructure}${investment}${recommendations}`,
  image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e",
  date: "April 1, 2024",
  category: "Tech Automation",
  author: "Ad Astra Team",
  readTime: "15 min read",
  tags: [
    "Future Trends",
    "South Florida",
    "Business Automation",
    "AI",
    "Technology Trends",
    "Digital Transformation",
    "Innovation"
  ]
};

export default futureTrends2025;