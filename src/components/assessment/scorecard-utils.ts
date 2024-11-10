import { Clock, Cog, GitBranch, Info, Zap } from 'lucide-react';

export const getIcon = (sectionTitle: string) => {
  switch (sectionTitle) {
    case "Process Details":
      return GitBranch;
    case "Technology":
      return Cog;
    case "Processes":
      return Zap;
    default:
      return Info;
  }
};

export const getBenefits = (sectionTitle: string) => {
  const benefits: Record<string, { time: string; cost: string; growth: string }> = {
    "Process Details": {
      time: "Reduce manual work by 70%",
      cost: "Cut operational costs by 40%",
      growth: "Scale operations 3x faster"
    },
    "Technology": {
      time: "Automate 80% of tasks",
      cost: "Reduce tech overhead by 50%",
      growth: "10x faster processing speed"
    },
    "Processes": {
      time: "Save 30+ hours weekly",
      cost: "Minimize errors by 90%",
      growth: "Double team productivity"
    }
  };
  return benefits[sectionTitle] || { time: "", cost: "", growth: "" };
};

export const getSectionExplanation = (sectionTitle: string) => {
  const explanations = {
    "Process Details": {
      title: "Workflow Automation Potential",
      description: "This score evaluates how well your current processes could be automated. A high score means your workflows are well-documented and ready for AI-powered optimization, leading to significant time and cost savings."
    },
    "Technology": {
      title: "Digital Transformation Readiness",
      description: "Measures how prepared your tech infrastructure is for modern automation. Higher scores indicate your systems are well-positioned for seamless AI integration and rapid deployment of automation solutions."
    },
    "Processes": {
      title: "Operational Excellence Score",
      description: "Analyzes your current operational efficiency and automation opportunities. Higher scores show greater potential for transforming manual tasks into streamlined, automated workflows that boost productivity."
    }
  };
  return explanations[sectionTitle] || { title: "", description: "" };
};

export const getTooltipContent = (sectionTitle: string, score: number) => {
  const explanations: Record<string, { description: string; impact: string }> = {
    "Process Details": {
      description: "Your processes show strong potential for automation with clear documentation and standardized workflows.",
      impact: score >= 80 
        ? "Your processes are perfectly structured for AI automation"
        : score >= 60
        ? "Good foundation for automation with quick wins available"
        : "High potential for transformation through automation"
    },
    "Technology": {
      description: "Your current tech stack demonstrates readiness for advanced automation integration.",
      impact: score >= 80
        ? "Your systems are primed for advanced AI integration"
        : score >= 60
        ? "Well-positioned for automation with some upgrades"
        : "Strategic tech improvements will enable automation"
    },
    "Processes": {
      description: "Your operational processes show significant optimization potential through automation.",
      impact: score >= 80
        ? "Ready for enterprise-level automation deployment"
        : score >= 60
        ? "Good automation opportunities identified"
        : "Major efficiency gains possible through automation"
    }
  };

  return explanations[sectionTitle] || { description: "Section score based on assessment responses", impact: "" };
};