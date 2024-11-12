import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Award, Clock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const TrustSignals = () => {
  return (
    <section className="py-16 px-4 bg-space-light/50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Commitment to Excellence</h2>
          <p className="text-xl text-gray-300">Backed by industry expertise and proven methodologies</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-space border-gold/20">
            <CardContent className="p-6">
              <Shield className="h-12 w-12 text-gold mb-4" />
              <h3 className="text-xl font-semibold mb-2">100% Satisfaction Guarantee</h3>
              <p className="text-gray-300">
                We guarantee your satisfaction with our service. If our initial consultation doesn't meet your expectations, we'll provide additional consultation sessions at no extra charge.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-space border-gold/20">
            <CardContent className="p-6">
              <Award className="h-12 w-12 text-gold mb-4" />
              <h3 className="text-xl font-semibold mb-2">Expert Team</h3>
              <p className="text-gray-300">
                Our team brings decades of combined experience in process optimization and automation.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-space border-gold/20">
            <CardContent className="p-6">
              <Clock className="h-12 w-12 text-gold mb-4" />
              <h3 className="text-xl font-semibold mb-2">Fast Implementation</h3>
              <p className="text-gray-300">
                See initial results within 30 days of implementing our recommendations.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-space border-gold/20">
          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-4">Process Optimization Expertise</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-5 w-5 text-gold flex-shrink-0 mt-1" />
                    <span>Certified Process Improvement Specialists</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-5 w-5 text-gold flex-shrink-0 mt-1" />
                    <span>Data-Driven Methodology</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-5 w-5 text-gold flex-shrink-0 mt-1" />
                    <span>Industry-Standard Security Protocols</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-5 w-5 text-gold flex-shrink-0 mt-1" />
                    <span>Continuous Support & Training</span>
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-gold/10 rounded-lg">
                  <h4 className="font-semibold mb-2">Free Process Audit</h4>
                  <p className="text-sm text-gray-300 mb-4">
                    Comprehensive analysis worth $1,500 - Currently offered at no cost
                  </p>
                  <Button className="w-full bg-gold hover:bg-gold-light text-space">
                    Claim Your Free Audit
                  </Button>
                </div>
                <p className="text-sm text-gray-400 text-center">
                  Limited availability. Schedule your session today.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default TrustSignals;
