import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Database, CheckCircle } from 'lucide-react';
import { useAuditForm } from '@/contexts/AuditFormContext';

const CRMSystems = () => {
  const { openAuditForm } = useAuditForm();

  return (
    <div className="pt-20 min-h-screen bg-space">
      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <Database className="h-16 w-16 text-gold mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold mb-6">CRM Systems</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Custom-built CRM solutions that streamline your business processes and enhance customer relationships.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <Card className="p-8 bg-space-light border-gold/20">
            <h2 className="text-2xl font-bold mb-6">What We Offer</h2>
            <ul className="space-y-4">
              {[
                "Customized workflow automation",
                "Industry-specific templates",
                "Integration with existing tools",
                "Automated reporting systems",
                "Training and documentation",
                "Ongoing maintenance & support"
              ].map((feature, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-gold mr-3 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-8 bg-space-light border-gold/20">
            <h2 className="text-2xl font-bold mb-6">Benefits</h2>
            <ul className="space-y-4">
              {[
                "Reduce operational costs by 40%",
                "Improve customer satisfaction",
                "Streamline communication",
                "Enhanced data organization",
                "Better lead tracking",
                "Increased team productivity"
              ].map((benefit, index) => (
                <li key={index} className="flex items-start">
                  <ArrowRight className="h-6 w-6 text-gold mr-3 flex-shrink-0" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <div className="text-center">
          <Button 
            onClick={openAuditForm}
            className="bg-gold hover:bg-gold-light text-space font-medium text-lg px-8 py-6"
          >
            Get Your Free CRM Audit
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CRMSystems;