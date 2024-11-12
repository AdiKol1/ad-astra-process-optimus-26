import React from 'react';
import { 
  Rocket, 
  Building, 
  Globe, 
  Brain, 
  BarChart, 
  MessageSquare,
  ArrowRight
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const services = [
  {
    icon: <Rocket className="h-12 w-12 mb-4 text-gold" />,
    title: "AI Process Automation",
    description: "Transform your operations with cutting-edge AI automation solutions that streamline workflows and boost efficiency.",
    benefits: [
      "Reduce manual tasks by 75%",
      "24/7 automated operations",
      "Smart workflow optimization"
    ],
    link: "/services/automation"
  },
  {
    icon: <Brain className="h-12 w-12 mb-4 text-gold" />,
    title: "Predictive Analytics",
    description: "Harness the power of AI to predict trends, optimize decisions, and stay ahead of market changes.",
    benefits: [
      "Real-time market insights",
      "Accurate forecasting",
      "Data-driven strategies"
    ],
    link: "/services/analytics"
  },
  {
    icon: <BarChart className="h-12 w-12 mb-4 text-gold" />,
    title: "Performance Optimization",
    description: "Maximize your business potential with AI-driven performance improvements and strategic enhancements.",
    benefits: [
      "40% efficiency increase",
      "Cost optimization",
      "Resource allocation"
    ],
    link: "/services/optimization"
  },
  {
    icon: <MessageSquare className="h-12 w-12 mb-4 text-gold" />,
    title: "AI Communication Suite",
    description: "Enhance customer engagement with intelligent communication tools and automated response systems.",
    benefits: [
      "24/7 customer support",
      "Personalized interactions",
      "Multi-channel presence"
    ],
    link: "/services/communication"
  },
  {
    icon: <Building className="h-12 w-12 mb-4 text-gold" />,
    title: "Enterprise Solutions",
    description: "Custom enterprise-grade AI solutions designed to scale with your business needs and goals.",
    benefits: [
      "Scalable architecture",
      "Enterprise integration",
      "Custom development"
    ],
    link: "/services/enterprise"
  },
  {
    icon: <Globe className="h-12 w-12 mb-4 text-gold" />,
    title: "Global Market Analysis",
    description: "Expand your reach with AI-powered market analysis and data-driven growth strategies.",
    benefits: [
      "Market opportunity identification",
      "Competitive analysis",
      "Growth planning"
    ],
    link: "/services/market-analysis"
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
            Leverage the power of AI to transform your business operations and achieve unprecedented growth
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
                  onClick={() => navigate(service.link)}
                  className="mt-auto bg-gold hover:bg-gold-light text-space font-medium w-full"
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