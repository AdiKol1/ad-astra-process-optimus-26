import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Users2, TrendingUp, Clock, DollarSign } from 'lucide-react';

const metrics = [
  {
    icon: Users2,
    value: "1000+",
    label: "Clients Served",
    description: "Trusted by businesses worldwide"
  },
  {
    icon: TrendingUp,
    value: "85%",
    label: "Average Efficiency Gain",
    description: "Improvement in process efficiency"
  },
  {
    icon: Clock,
    value: "60%",
    label: "Time Saved",
    description: "Reduction in processing time"
  },
  {
    icon: DollarSign,
    value: "$2M+",
    label: "Client Savings",
    description: "Annual cost savings achieved"
  }
];

const SuccessMetrics = () => {
  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Impact</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Delivering measurable results through process optimization
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <Card key={index} className="bg-space-light/50 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 rounded-full bg-gold/10">
                      <Icon className="h-6 w-6 text-gold" />
                    </div>
                  </div>
                  <div className="mb-2">
                    <div className="text-2xl font-bold mb-1">{metric.value}</div>
                    <div className="text-sm font-medium text-gold">{metric.label}</div>
                  </div>
                  <p className="text-sm text-gray-400">{metric.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SuccessMetrics;