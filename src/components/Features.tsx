import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Cpu, BarChart2, Clock, Shield, Zap, Layers, Sliders, Users, MessageSquare } from 'lucide-react';

const features = [
  {
    title: "AI-Powered Process Analysis",
    description: "Our intelligent system analyzes your existing workflows to identify inefficiencies, bottlenecks, and opportunities for automation with minimal disruption to your operations.",
    icon: Cpu
  },
  {
    title: "Drag-and-Drop Workflow Builder",
    description: "Create sophisticated automation workflows without coding using our intuitive visual builder that connects your systems and processes with simple drag-and-drop actions.",
    icon: Layers
  },
  {
    title: "Real-Time Performance Dashboard",
    description: "Monitor the impact of your automation initiatives with comprehensive analytics that track time saved, error reduction, and productivity improvements in real-time.",
    icon: BarChart2
  },
  {
    title: "Seamless Integration Hub",
    description: "Connect with over 200+ popular business applications and services through our extensive library of pre-built connectors and open API architecture.",
    icon: Sliders
  },
  {
    title: "Intelligent Document Processing",
    description: "Extract, classify and process information from any document type with our AI-powered document handling system that learns and improves over time.",
    icon: Shield
  },
  {
    title: "Rapid Implementation Framework",
    description: "Get your automation solutions up and running in days, not months, with our proven implementation methodology and pre-built process templates.",
    icon: Clock
  },
  {
    title: "Collaborative Workflow Environment",
    description: "Enable teams to collaborate on process improvements with shared workflows, approval systems, and role-based permissions that maintain security.",
    icon: Users
  },
  {
    title: "Conversational Process Assistant",
    description: "Interact with your automation platform using natural language to create, modify, or monitor workflows through our AI-powered conversational interface.",
    icon: MessageSquare
  },
  {
    title: "Scalable Performance Engine",
    description: "Handle enterprise-level automation needs with our cloud-based infrastructure that scales automatically to meet your processing demands without performance degradation.",
    icon: Zap
  }
];

const Features = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">
            Platform Features
          </h1>
          <p className="text-xl text-muted-foreground mb-16">
            Our comprehensive suite of tools and technologies enables businesses to transform their operations through intelligent automation.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={index} 
                className="rounded-lg border bg-card text-card-foreground shadow-sm p-8 transition-all hover:shadow-md"
              >
                <div className="mb-6">
                  <Icon className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-20 bg-muted rounded-lg p-8 text-center">
          <h2 className="text-2xl font-semibold mb-4">Ready to transform your business processes?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Take our free process assessment to discover how our platform can help you automate workflows, reduce errors, and increase productivity.
          </p>
          <Link
            to="/assessment"
            className="inline-flex items-center justify-center rounded-md text-md font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-6 py-3"
          >
            Start Free Assessment <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Features;
