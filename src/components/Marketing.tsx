import React from 'react';
import { Card } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

const Marketing = () => {
  const benefits = [
    "Reduce operational costs by up to 40%",
    "Automate 70% of repetitive tasks",
    "Increase team productivity by 300%",
    "ROI guaranteed within 90 days"
  ];

  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div>
          <div className="inline-block px-4 py-2 bg-gold/10 rounded-full text-gold mb-4">
            Trusted by Industry Leaders
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-8">
            Transform Your Business Operations
          </h2>
          <div className="space-y-4 mb-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-3">
                <CheckCircle className="text-gold h-6 w-6 flex-shrink-0" />
                <p className="text-xl text-gray-300">{benefit}</p>
              </div>
            ))}
          </div>
          <div className="p-4 bg-space-light rounded-lg">
            <p className="text-gold font-semibold">"Ad Astra helped us scale our operations 5x while reducing costs by 40%. Their process optimization strategy was game-changing."</p>
            <p className="text-sm text-gray-400 mt-2">- Sarah Chen, CEO of TechFlow Solutions</p>
          </div>
        </div>
        <div className="relative">
          <div className="aspect-video rounded-lg overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d"
              alt="Professional team working on process optimization"
              className="object-cover w-full h-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Marketing;