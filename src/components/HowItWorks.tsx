import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ClipboardCheck, LineChart, Lightbulb, Rocket } from 'lucide-react';

const steps = [
  {
    icon: <ClipboardCheck className="h-12 w-12 text-gold mb-4" />,
    title: "1. Complete Assessment",
    description: "Fill out our quick assessment form to help us understand your business processes"
  },
  {
    icon: <LineChart className="h-12 w-12 text-gold mb-4" />,
    title: "2. Get Analysis",
    description: "Our experts analyze your current processes and identify optimization opportunities"
  },
  {
    icon: <Lightbulb className="h-12 w-12 text-gold mb-4" />,
    title: "3. Review Solutions",
    description: "Receive customized recommendations and ROI projections for your business"
  },
  {
    icon: <Rocket className="h-12 w-12 text-gold mb-4" />,
    title: "4. Implementation",
    description: "Work with our team to implement the solutions and track improvements"
  }
];

const HowItWorks = () => {
  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            How It Works
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Our streamlined process helps you achieve optimal results in four simple steps
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <Card key={index} className="bg-space border-gold/20 relative overflow-hidden">
              <CardContent className="p-6 text-center">
                {step.icon}
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-gray-300">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;