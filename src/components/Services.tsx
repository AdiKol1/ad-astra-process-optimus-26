import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Database, Users, FileText } from 'lucide-react';

const services = [
  {
    title: "CRM Systems",
    description: "Custom-built CRM solutions that streamline your business processes and enhance customer relationships. Our AI-powered systems help you manage contacts, track interactions, and automate follow-ups.",
    link: "/services/crm-systems",
    icon: Database
  },
  {
    title: "Lead Generation Systems",
    description: "AI-powered lead generation and qualification systems that automate your outreach and conversion process. Generate high-quality leads and optimize your sales funnel with machine learning.",
    link: "/services/lead-generation",
    icon: Users
  },
  {
    title: "Content Generation Systems",
    description: "Automated content creation systems that produce high-quality, SEO-optimized content at scale. Create engaging blog posts, social media content, and marketing materials with AI assistance.",
    link: "/services/content-generation",
    icon: FileText
  }
];

const Services = () => {
  return (
    <section className="py-24 bg-background" id="services">
      <div className="container">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Our Services
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-12">
            Discover our range of AI-powered solutions designed to transform your business processes and drive growth.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div 
                key={index} 
                className="rounded-lg border bg-card text-card-foreground shadow-sm p-8 transition-all hover:shadow-md"
              >
                <div className="mb-6">
                  <Icon className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  {service.title}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {service.description}
                </p>
                <Link
                  to={service.link}
                  className="inline-flex items-center text-primary hover:text-primary/90 font-medium"
                >
                  Learn more <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;