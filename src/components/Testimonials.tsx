import React from 'react';
import { Card } from '@/components/ui/card';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: "John Smith",
    role: "Marketing Director",
    company: "TechCorp Inc.",
    content: "Ad Astra's AI-powered marketing strategies helped us increase our conversion rates by 150% in just three months.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
  },
  {
    name: "Emily Rodriguez",
    role: "CEO",
    company: "Growth Dynamics",
    content: "The ROI we've seen from Ad Astra's campaigns has been phenomenal. They truly understand how to leverage AI for maximum impact.",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956"
  }
];

const Testimonials = () => {
  return (
    <section className="py-20 px-4 bg-space-light" id="testimonials">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">Client Success Stories</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="p-6 bg-space border-gold/20">
              <div className="flex items-start space-x-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="flex items-center space-x-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                    ))}
                  </div>
                  <p className="text-gray-300 mb-4">{testimonial.content}</p>
                  <div>
                    <p className="font-bold">{testimonial.name}</p>
                    <p className="text-sm text-gray-400">{testimonial.role} at {testimonial.company}</p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;