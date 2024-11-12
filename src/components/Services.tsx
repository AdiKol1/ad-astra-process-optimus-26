import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Bot, Database, MessageSquare, Cog, FileText } from 'lucide-react';

const services = [
  {
    icon: <Database className="h-12 w-12 mb-4 text-gold" />,
    title: "CRM Systems",
    description: "Custom-built CRM solutions that streamline your business processes and enhance customer relationships.",
    benefits: [
      "Customized workflow automation",
      "Industry-specific templates",
      "Ongoing maintenance & support"
    ],
    link: "/services/crm"
  },
  {
    icon: <Bot className="h-12 w-12 mb-4 text-gold" />,
    title: "Lead Generation Systems",
    description: "AI-powered lead generation and qualification systems that automate your outreach and conversion process.",
    benefits: [
      "AI-powered cold email campaigns",
      "Intelligent chatbot qualification",
      "Automated lead enrichment"
    ],
    link: "/services/lead-generation"
  },
  {
    icon: <FileText className="h-12 w-12 mb-4 text-gold" />,
    title: "Content Generation Systems",
    description: "Automated content creation systems that produce high-quality, SEO-optimized content at scale.",
    benefits: [
      "AI blog post generation",
      "Content repurposing automation",
      "SEO optimization workflows"
    ],
    link: "/services/content"
  },
  {
    icon: <Cog className="h-12 w-12 mb-4 text-gold" />,
    title: "Project Management Systems",
    description: "Streamlined project management solutions with custom ClickUp workflows and integrations.",
    benefits: [
      "Custom ClickUp buildouts",
      "Tool integrations & automation",
      "Training & documentation"
    ],
    link: "/services/project-management"
  },
  {
    icon: <MessageSquare className="h-12 w-12 mb-4 text-gold" />,
    title: "Client Onboarding Systems",
    description: "Automated onboarding processes that ensure a smooth and consistent client experience.",
    benefits: [
      "Automated welcome sequences",
      "Contract & payment automation",
      "Personalized onboarding paths"
    ],
    link: "/services/onboarding"
  }
];

const Services = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 px-4 bg-space">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Our Services
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Transform your business operations with our AI-powered automation solutions
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card 
              key={index} 
              className="bg-space-light border-gold/20 p-8 hover:transform hover:scale-105 transition-all duration-300"
            >
              <div className="flex flex-col h-full">
                <div className="text-center mb-6">
                  {service.icon}
                  <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
                  <p className="text-gray-300 mb-6">{service.description}</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {service.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-center text-gray-300">
                      <ArrowRight className="h-4 w-4 text-gold mr-2 flex-shrink-0" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  className="mt-auto bg-gold hover:bg-gold-light text-space font-medium w-full"
                  onClick={() => navigate(service.link)}
                >
                  Learn More
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;