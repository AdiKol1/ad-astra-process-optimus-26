import { BlogPost } from '@/types/blog';
import { introduction } from './sections/introduction';
import { marketOverview } from './sections/market-overview';
import { solutions } from './sections/solutions';
import { implementation } from './sections/implementation';
import { costAnalysis } from './sections/cost-analysis';
import { sectorSolutions } from './sections/sector-solutions';
import { strategies } from './sections/strategies';
import { trends } from './sections/trends';

export const logisticsAutomation: BlogPost = {
  id: "miami-logistics-automation-2024",
  title: "How Automation is Revolutionizing Miami's Logistics Sector [2024 Guide]",
  slug: "miami-logistics-automation-2024",
  excerpt: "Discover how Miami's logistics companies are using automation to optimize operations, reduce costs, and improve efficiency. Complete implementation guide for logistics businesses in Miami-Dade, Port Miami, and surrounding areas.",
  content: `${introduction}${marketOverview}${solutions}${implementation}${costAnalysis}${sectorSolutions}${strategies}${trends}`,
  image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
  date: "March 29, 2024",
  category: "Tech Automation",
  author: "Ad Astra Team",
  readTime: "15 min read",
  tags: [
    "Logistics Automation",
    "Miami Tech",
    "Supply Chain",
    "Port Miami",
    "Warehouse Automation",
    "Transportation Tech",
    "Customs Processing"
  ]
};

export default logisticsAutomation;