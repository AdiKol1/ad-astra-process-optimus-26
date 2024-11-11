import React from 'react';
import { Rocket, Building, Globe } from 'lucide-react';
import { Card } from '@/components/ui/card';

const services = [
  {
    icon: <Rocket className="h-8 w-8 mb-3 text-gold" />,
    title: "Process Automation",
    description: "Streamline operations with cutting-edge automation solutions"
  },
  {
    icon: <Building className="h-8 w-8 mb-3 text-gold" />,
    title: "Strategic Planning",
    description: "Build robust systems with Stoic principles as foundation"
  },
  {
    icon: <Globe className="h-8 w-8 mb-3 text-gold" />,
    title: "Growth Optimization",
    description: "Scale your business with sustainable, proven methods"
  }
];

const Services = () => {
  return (
    <section className="py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-10">Our Services</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <Card key={index} className="bg-space-light p-6 hover:transform hover:scale-105 transition-transform duration-300">
              <div className="text-center">
                {service.icon}
                <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                <p className="text-gray-300">{service.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;