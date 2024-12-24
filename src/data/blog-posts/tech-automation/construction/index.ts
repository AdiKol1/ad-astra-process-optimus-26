import { BlogPost } from '@/types/blog';
import { constructionOverview } from './overview';
import { automationSolutions } from './solutions';
import { implementationGuide } from './implementation';
import { costAnalysis } from './costs';

export const constructionAutomationPost: BlogPost = {
  id: "south-florida-construction-automation-2024",
  title: "Automation Solutions for South Florida Construction Companies [2024 Complete Guide]",
  slug: "south-florida-construction-automation-2024",
  excerpt: "Discover how South Florida construction companies are using automation to reduce costs, improve efficiency, and win more bids. Implementation guide + ROI analysis for Miami-Dade, Broward, and Palm Beach construction firms.",
  content: `
## Introduction
In South Florida's booming construction market, automation is becoming a critical differentiator. From Miami's high-rise developments to Palm Beach's luxury builds, leading construction companies are leveraging automation to stay competitive and profitable.

${constructionOverview.content}

${automationSolutions.content}

${implementationGuide.content}

${costAnalysis.content}

## Call to Action
Ready to automate your South Florida construction company? Get your free automation assessment today.

[CTA Button: "Get Your Free Construction Automation Assessment"]

## Additional Resources
- Download implementation guide
- Access ROI calculator
- Watch success stories
- Schedule consultation
  `,
  image: "https://images.unsplash.com/photo-1487887235947-a955ef187fcc",
  date: "March 28, 2024",
  category: "Tech Automation",
  author: "Ad Astra Team",
  readTime: "15 min read",
  tags: [
    "Construction Automation",
    "South Florida",
    "Miami Construction",
    "Technology",
    "ROI Analysis",
    "Implementation Guide",
    "Construction Technology",
    "Automation Solutions"
  ]
};