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

export const getSectionExplanation = (sectionTitle: string): { title: string; description: string } => {
  const explanations: Record<string, { title: string; description: string }> = {
    "Process Details": {
      title: "Current Workflow Analysis",
      description: "This score reflects how well your current processes could benefit from automation. Higher scores indicate greater potential for transformation through AI and automation."
    },
    "Technology": {
      title: "Technical Readiness",
      description: "Evaluates your current tech stack's compatibility with modern automation solutions. Higher scores mean easier integration and faster implementation."
    },
    "Processes": {
      title: "Operational Efficiency",
      description: "Measures the complexity and volume of your manual processes. Higher scores indicate more significant opportunities for time and cost savings through automation."
    }
  };
  return explanations[sectionTitle] || { title: "", description: "" };
};

export const getTooltipContent = (sectionTitle: string, score: number) => {
  const explanations: Record<string, { description: string; impact: string }> = {
    "Process Details": {
      description: "Evaluates your workflow automation potential",
      impact: score >= 80 
        ? "Your processes are ready for immediate automation benefits"
        : score >= 60
        ? "Quick wins available through targeted automation"
        : "Major ROI potential through process transformation"
    },
    "Technology": {
      description: "Measures your tech stack's automation readiness",
      impact: score >= 80
        ? "Ideal setup for advanced AI/automation integration"
        : score >= 60
        ? "Strategic upgrades will unlock automation potential"
        : "Technology modernization will drive massive gains"
    },
    "Processes": {
      description: "Analyzes workflow efficiency opportunities",
      impact: score >= 80
        ? "Ready for enterprise-grade automation solutions"
        : score >= 60
        ? "Clear path to optimization through automation"
        : "Significant optimization potential identified"
    }
  };

  const content = explanations[sectionTitle];
  if (!content) return { description: "Section score based on assessment responses", impact: "" };
  return content;
};