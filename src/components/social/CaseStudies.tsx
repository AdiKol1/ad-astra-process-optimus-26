import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowUpRight, BarChart2, Users, Clock } from 'lucide-react';

const caseStudies = [
  {
    company: "TechCorp Solutions",
    industry: "Software Development",
    results: {
      processTime: "60% reduction in process time",
      savings: "$250,000 annual savings",
      satisfaction: "95% employee satisfaction"
    },
    quote: "The automation implementation exceeded our expectations in both efficiency gains and ROI."
  },
  {
    company: "HealthCare Plus",
    industry: "Healthcare",
    results: {
      processTime: "75% faster patient processing",
      savings: "$400,000 cost reduction",
      satisfaction: "92% patient satisfaction"
    },
    quote: "Streamlined operations have dramatically improved our patient care quality."
  }
];

const CaseStudies = () => {
  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Success Stories</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            See how leading organizations have transformed their operations with our solutions
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {caseStudies.map((study, index) => (
            <Card key={index} className="bg-space-light/50 backdrop-blur-sm hover:bg-space-light/70 transition-all">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-1">{study.company}</h3>
                    <p className="text-gold text-sm">{study.industry}</p>
                  </div>
                  <ArrowUpRight className="text-gold" />
                </div>

                <div className="grid grid-cols-1 gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-gold/10">
                      <Clock className="h-4 w-4 text-gold" />
                    </div>
                    <span className="text-sm">{study.results.processTime}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-gold/10">
                      <BarChart2 className="h-4 w-4 text-gold" />
                    </div>
                    <span className="text-sm">{study.results.savings}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-gold/10">
                      <Users className="h-4 w-4 text-gold" />
                    </div>
                    <span className="text-sm">{study.results.satisfaction}</span>
                  </div>
                </div>

                <blockquote className="text-sm italic text-gray-300 border-l-2 border-gold pl-4">
                  "{study.quote}"
                </blockquote>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CaseStudies;