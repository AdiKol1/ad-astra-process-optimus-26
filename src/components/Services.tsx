import React from 'react';
import { 
  Target,
  Brain,
  ChartBar,
  Megaphone,
  ArrowRight
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const services = [
  {
    icon: <Target className="h-12 w-12 mb-4 text-gold" />,
    title: "AI Marketing Strategy",
    description: "Transform your marketing with data-driven AI strategies that deliver measurable ROI and sustainable growth.",
    benefits: [
      "Custom marketing roadmap",
      "Competitive positioning",
      "Growth opportunity analysis"
    ],
    link: "/services/strategy"
  },
  {
    icon: <Brain className="h-12 w-12 mb-4 text-gold" />,
    title: "Marketing Automation",
    description: "Streamline your marketing operations with intelligent automation that saves time and reduces costs while boosting results.",
    benefits: [
      "Workflow automation",
      "Campaign orchestration",
      "Lead nurturing automation"
    ],
    link: "/services/automation"
  },
  {
    icon: <ChartBar className="h-12 w-12 mb-4 text-gold" />,
    title: "AI Performance Optimization",
    description: "Continuously optimize your marketing performance with AI-powered insights and real-time adjustments.",
    benefits: [
      "Real-time optimization",
      "A/B testing automation",
      "Budget optimization"
    ],
    link: "/services/optimization"
  },
  {
    icon: <Megaphone className="h-12 w-12 mb-4 text-gold" />,
    title: "AI Content Generation",
    description: "Create high-converting marketing content at scale with AI that maintains your brand voice and messaging.",
    benefits: [
      "Multi-channel content",
      "SEO optimization",
      "Personalized messaging"
    ],
    link: "/services/content"
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
            Leverage the power of AI to transform your marketing operations and achieve unprecedented growth
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
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