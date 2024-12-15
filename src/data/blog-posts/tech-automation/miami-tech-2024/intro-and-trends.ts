import { BlogPostSection } from '@/types/blog';

export const introAndTrends: BlogPostSection = {
  introduction: `Miami's transformation into a major tech hub has accelerated the adoption of business process automation. From Brickell's financial district to Wynwood's tech corridor, companies are making strategic investments in automation to maintain their competitive edge.`,
  
  investmentTrends: {
    stats: [
      { metric: "$1.2B invested in tech automation (2023)" },
      { metric: "85% of Miami tech companies increasing automation budgets" },
      { metric: "45% average operational cost reduction" },
      { metric: "3.5x average ROI within first year" }
    ],
    districts: [
      {
        name: "Brickell Tech Corridor",
        stats: [
          "120+ tech companies",
          "$500M+ in automation investments",
          "75% adoption rate"
        ]
      },
      {
        name: "Wynwood Innovation District",
        stats: [
          "85+ tech startups",
          "$300M+ in technology upgrades",
          "82% using advanced automation"
        ]
      },
      {
        name: "Downtown Miami Tech Hub",
        stats: [
          "150+ technology firms",
          "$400M+ in process improvements",
          "70% automation implementation"
        ]
      }
    ]
  }
};