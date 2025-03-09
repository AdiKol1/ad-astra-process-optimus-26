import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, TrendingUp, BarChart2, ShieldCheck, FileText, Database, Users, Mail, Calendar, GitBranch, Lightbulb } from 'lucide-react';

const solutions = [
  {
    title: "Document Automation",
    description: "Eliminate manual document processing with AI-powered systems that extract, classify, and route information from invoices, contracts, and forms, reducing processing time by up to 80%.",
    benefits: ["Reduced processing time", "Minimized data entry errors", "Improved compliance tracking"],
    icon: FileText
  },
  {
    title: "Customer Service Automation",
    description: "Deploy intelligent chatbots and automated ticket routing systems that handle routine inquiries, allowing your team to focus on complex customer issues and increasing satisfaction rates.",
    benefits: ["24/7 customer support", "Faster response times", "Consistent service quality"],
    icon: Users
  },
  {
    title: "Email & Communication Workflows",
    description: "Implement smart email filtering, automated responses, and communication workflows that ensure important messages are prioritized and routine communications are handled efficiently.",
    benefits: ["Reduced inbox overload", "Faster response times", "Improved team coordination"],
    icon: Mail
  },
  {
    title: "Data Integration & Synchronization",
    description: "Connect disparate systems with automated data flows that ensure information is consistent across your organization, eliminating duplicate entries and information silos.",
    benefits: ["Single source of truth", "Eliminated manual data transfers", "Real-time information access"],
    icon: Database
  },
  {
    title: "Scheduling & Resource Management",
    description: "Optimize resource allocation with intelligent scheduling systems that automatically assign tasks, manage calendars, and coordinate team resources based on availability and skills.",
    benefits: ["Optimized resource utilization", "Reduced scheduling conflicts", "Improved project planning"],
    icon: Calendar
  },
  {
    title: "Approval & Decision Workflows",
    description: "Streamline approval processes with automated workflows that route requests to the right decision-makers, track status, and ensure timely responses without constant follow-ups.",
    benefits: ["Accelerated decision cycles", "Clear accountability", "Reduced bottlenecks"],
    icon: GitBranch
  },
  {
    title: "Reporting & Analytics Automation",
    description: "Generate comprehensive reports automatically with systems that collect, analyze, and visualize data from multiple sources, providing actionable insights without manual compilation.",
    benefits: ["Data-driven decision making", "Time saved on report creation", "Consistent performance tracking"],
    icon: BarChart2
  },
  {
    title: "Quality Control & Error Prevention",
    description: "Implement automated validation systems that catch errors before they impact your business, ensuring consistent quality and compliance across all processes.",
    benefits: ["Reduced error rates", "Consistent quality standards", "Improved regulatory compliance"],
    icon: ShieldCheck
  },
  {
    title: "Process Optimization & Bottleneck Detection",
    description: "Identify and eliminate workflow bottlenecks with intelligent process mining that analyzes your operations and suggests improvements to maximize efficiency.",
    benefits: ["Streamlined workflows", "Eliminated redundancies", "Continuous improvement"],
    icon: TrendingUp
  }
];

const Solutions = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">
            Process Automation Solutions
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Our custom automation solutions help businesses increase productivity and revenue while reducing errors and bottlenecks.
          </p>
          <div className="flex justify-center mb-16">
            <Link
              to="/assessment"
              className="inline-flex items-center justify-center rounded-md text-md font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-6 py-3"
            >
              Start Your Free Assessment <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {solutions.map((solution, index) => (
            <div 
              key={index} 
              className="rounded-lg border bg-card text-card-foreground shadow-sm p-8 transition-all hover:shadow-md flex flex-col h-full"
            >
              <div className="mb-6 flex items-center">
                {React.createElement(solution.icon, { className: "h-8 w-8 text-primary mr-3" })}
                <h3 className="text-xl font-semibold">{solution.title}</h3>
              </div>
              <p className="text-muted-foreground mb-6 flex-grow">
                {solution.description}
              </p>
              <div className="border-t pt-4">
                <h4 className="font-medium mb-2 text-sm uppercase tracking-wide text-muted-foreground">Key Benefits</h4>
                <ul className="space-y-2">
                  {solution.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start">
                      <Zap className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center">
          <div className="inline-flex items-center justify-center p-6 rounded-lg bg-muted mb-8">
            <Lightbulb className="h-10 w-10 text-primary mr-4" />
            <h2 className="text-2xl font-semibold">Not sure which solution is right for you?</h2>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Our process assessment will analyze your current workflows and recommend the perfect automation solutions for your specific business needs.
          </p>
          <Link
            to="/assessment"
            className="inline-flex items-center justify-center rounded-md text-md font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-6 py-3"
          >
            Take the Free Assessment <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Solutions;
