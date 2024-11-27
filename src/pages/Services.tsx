import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Rocket, Target, BarChart2, Globe } from 'lucide-react';

const services = [
  {
    icon: <Rocket className="h-8 w-8 mb-4 text-gold" />,
    title: "AI-Powered Marketing Automation",
    description: "Streamline your marketing operations with our advanced AI automation solutions. Increase efficiency and ROI while reducing manual work.",
    benefits: ["Reduce operational costs by 40%", "24/7 campaign optimization", "Real-time analytics"],
  },
  {
    icon: <Target className="h-8 w-8 mb-4 text-gold" />,
    title: "Predictive Analytics",
    description: "Leverage AI to predict market trends and customer behavior. Make data-driven decisions that drive growth.",
    benefits: ["Customer behavior prediction", "Market trend analysis", "ROI forecasting"],
  },
  {
    icon: <BarChart2 className="h-8 w-8 mb-4 text-gold" />,
    title: "Performance Marketing",
    description: "Optimize your marketing spend with AI-driven performance marketing strategies that deliver measurable results.",
    benefits: ["Targeted campaigns", "Real-time optimization", "Performance tracking"],
  },
  {
    icon: <Globe className="h-8 w-8 mb-4 text-gold" />,
    title: "Global Market Analysis",
    description: "Expand your reach with AI-powered market analysis and localization strategies.",
    benefits: ["Market opportunity identification", "Competitive analysis", "Local market insights"],
  },
];

const Services = () => {
  return (
    <div className="pt-20 min-h-screen bg-space">
      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Services</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Leverage the power of AI to transform your marketing strategy and achieve unprecedented growth
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="p-8 bg-space-light border-gold/20">
              <div className="flex flex-col h-full">
                {service.icon}
                <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
                <p className="text-gray-300 mb-6">{service.description}</p>
                <ul className="space-y-2 mb-8">
                  {service.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-center text-gray-300">
                      <ArrowRight className="h-4 w-4 text-gold mr-2" />
                      {benefit}
                    </li>
                  ))}
                </ul>
                <Button className="mt-auto bg-gold hover:bg-gold-light text-space">
                  Learn More
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;