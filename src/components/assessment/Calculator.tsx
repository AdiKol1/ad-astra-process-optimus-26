import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { calculateAutomationPotential } from '@/utils/calculations';

interface CalculatorProps {
  answers: Record<string, any>;
}

const Calculator = ({ answers }: CalculatorProps) => {
  const results = calculateAutomationPotential(answers);

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <SavingsCard 
        title="Potential Annual Savings"
        value={results.savings.annual}
      />
      <EfficiencyCard 
        title="Process Efficiency Gain"
        value={results.efficiency.productivity}
      />
    </div>
  );
};

const SavingsCard = ({ title, value }: { title: string; value: number }) => (
  <Card>
    <CardContent className="p-4">
      <h3 className="text-lg font-medium">{title}</h3>
      <div className="text-3xl font-bold text-gold">
        ${value.toLocaleString()}
      </div>
    </CardContent>
  </Card>
);

const EfficiencyCard = ({ title, value }: { title: string; value: number }) => (
  <Card>
    <CardContent className="p-4">
      <h3 className="text-lg font-medium">{title}</h3>
      <div className="text-3xl font-bold text-gold">
        {value}%
      </div>
    </CardContent>
  </Card>
);

export default Calculator;