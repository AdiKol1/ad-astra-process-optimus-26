import React from 'react';
import { Card } from '@/components/ui/card';
import { Search, DollarSign, TrendingUp } from 'lucide-react';

const BenefitsSection = () => {
  return (
    <div className="text-center mb-12">
      <h1 className="text-4xl font-bold tracking-tight mb-4">
        Discover Your Optimization Potential
      </h1>
      <p className="text-xl text-muted-foreground">
        Take our quick assessment to uncover opportunities for growth and efficiency
      </p>

      <div className="grid md:grid-cols-3 gap-8 mt-12">
        <Card className="p-6 flex flex-col items-center text-center">
          <Search className="h-12 w-12 mb-4 text-primary" />
          <h3 className="text-xl font-semibold mb-2">Process Analysis</h3>
          <p className="text-muted-foreground">
            Identify inefficiencies and bottlenecks
          </p>
        </Card>

        <Card className="p-6 flex flex-col items-center text-center">
          <DollarSign className="h-12 w-12 mb-4 text-primary" />
          <h3 className="text-xl font-semibold mb-2">Cost Savings</h3>
          <p className="text-muted-foreground">
            Calculate potential cost reductions
          </p>
        </Card>

        <Card className="p-6 flex flex-col items-center text-center">
          <TrendingUp className="h-12 w-12 mb-4 text-primary" />
          <h3 className="text-xl font-semibold mb-2">Growth Opportunities</h3>
          <p className="text-muted-foreground">
            Unlock your business potential
          </p>
        </Card>
      </div>
    </div>
  );
};

export default BenefitsSection;