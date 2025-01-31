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
      title: "Process Documentation & Structure",
      description: "This section evaluates how well your business processes are documented and structured. It looks at factors like the number of employees involved, transaction volumes, and how well-defined your workflows are. This helps determine if your processes are ready for automation."
    },
    "Technology": {
      title: "Digital Transformation Readiness",
      description: "This score evaluates your current technology infrastructure and systems. It determines how ready your tech stack is for implementing modern automation solutions."
    },
    "Processes": {
      title: "Current Operations Assessment",
      description: "This section analyzes your day-to-day operations and specific tasks being performed. It focuses on identifying which manual processes exist, how much time they take, and their error rates to determine automation opportunities."
    }
  };
  return explanations[sectionTitle] || { title: "", description: "" };
};

export const getTooltipContent = (sectionTitle: string, score: number) => {
  const explanations: Record<string, { description: string; impact: string }> = {
    "Process Details": {
      description: "Your process documentation and structure shows how ready your workflows are for automation. This includes factors like employee count and transaction volumes.",
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
      description: "Your daily operations and manual tasks show opportunities for automation improvements. This includes current error rates and time spent on manual work.",
      impact: score >= 80
        ? "Ready for enterprise-level automation deployment"
        : score >= 60
        ? "Good automation opportunities identified"
        : "Major efficiency gains possible through automation"
    }
  };

  return explanations[sectionTitle] || { description: "Section score based on assessment responses", impact: "" };
};