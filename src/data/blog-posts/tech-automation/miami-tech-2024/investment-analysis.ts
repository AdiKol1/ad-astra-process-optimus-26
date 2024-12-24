import { BlogPostSection } from '@/types/blog';

export const investmentAnalysis: BlogPostSection = {
  costStructure: {
    small: {
      size: "10-50 employees",
      initialInvestment: "$50,000-$100,000",
      monthlyMaintenance: "$2,000-$5,000",
      expectedROI: "250% first year"
    },
    medium: {
      size: "51-200 employees",
      initialInvestment: "$100,000-$300,000",
      monthlyMaintenance: "$5,000-$15,000",
      expectedROI: "300% first year"
    },
    large: {
      size: "201+ employees",
      initialInvestment: "$300,000+",
      monthlyMaintenance: "$15,000+",
      expectedROI: "350% first year"
    }
  }
};