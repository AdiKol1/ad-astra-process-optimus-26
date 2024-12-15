import { BlogPost } from '@/types/blog';
import { introAndTrends } from './intro-and-trends';
import { caseStudies } from './case-studies';
import { implementationGuide } from './implementation-guide';
import { investmentAnalysis } from './investment-analysis';
import { ecosystemAndFuture } from './ecosystem-and-future';

export const miamiTechAutomation2024: BlogPost = {
  id: "miami-tech-automation-2024",
  title: "Why Miami Tech Companies Are Investing Heavily in Business Process Automation [2024 Guide]",
  slug: "miami-tech-automation-2024",
  excerpt: "Discover why Miami's leading tech companies are doubling down on business process automation. Learn from Brickell's tech leaders and explore implementation strategies for your Miami-Dade business.",
  content: `
    ## Introduction
    ${introAndTrends.introduction}

    ## Miami's Tech Revolution By the Numbers
    ${JSON.stringify(introAndTrends.investmentTrends, null, 2)}

    ## Leading Miami Tech Companies' Automation Strategies
    ${JSON.stringify(caseStudies, null, 2)}

    ## Key Automation Areas in Miami Tech
    ${JSON.stringify(implementationGuide.automationAreas, null, 2)}

    ## Implementation Guide for Miami Tech Companies
    ${JSON.stringify(implementationGuide.phases, null, 2)}

    ## Investment Analysis
    ${JSON.stringify(investmentAnalysis, null, 2)}

    ## Miami Tech Ecosystem Support
    ${JSON.stringify(ecosystemAndFuture.localResources, null, 2)}

    ## Future Growth Projections
    ${JSON.stringify(ecosystemAndFuture.outlook2024, null, 2)}
  `,
  image: "https://images.unsplash.com/photo-1496307653780-42ee777d4833",
  date: "April 15, 2024",
  category: "Tech Automation",
  author: "Ad Astra Team",
  readTime: "15 min read",
  tags: [
    "Miami Tech",
    "Business Automation",
    "Digital Transformation",
    "Tech Hub",
    "Process Automation",
    "Implementation Strategy"
  ]
};