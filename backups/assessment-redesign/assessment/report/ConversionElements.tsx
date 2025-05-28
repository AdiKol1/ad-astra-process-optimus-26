import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, TrendingUp, DollarSign, Users, ArrowRight } from 'lucide-react';

interface ConversionWrapperProps {
  metrics: {
    potentialSavings: number;
    timeReduction: number;
    errorReduction: number;
    implementationTime: string;
  };
  industry: string;
}

export const ConversionWrapper: React.FC<ConversionWrapperProps> = ({
  metrics,
  industry
}) => {
  return (
    <div className="space-y-6">
      {/* Value Preview Banner */}
      <Card className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <CardContent className="p-6">
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <ValueMetric
              icon={DollarSign}
              value={`$${metrics.potentialSavings.toLocaleString()}`}
              label="Annual Savings Potential"
            />
            <ValueMetric
              icon={Clock}
              value={`${metrics.timeReduction}%`}
              label="Time Reduction"
            />
            <ValueMetric
              icon={TrendingUp}
              value={`${metrics.errorReduction}%`}
              label="Error Reduction"
            />
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-xl mb-4">
              Your {industry} business qualifies for our rapid implementation program
            </p>
            <Button 
              size="lg" 
              variant="secondary"
              className="bg-white text-blue-600 hover:bg-blue-50"
              onClick={() => window.open('https://calendly.com/your-booking-link', '_blank')}
            >
              Schedule Your Strategy Call
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Action Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        <QuickActionCard
          title="Fast-Track Implementation"
          description={`Implementation in just ${metrics.implementationTime}`}
          ctaText="See Implementation Plan"
        />
        <QuickActionCard
          title="ROI Calculator"
          description="See detailed breakdown of your savings"
          ctaText="View ROI Details"
        />
      </div>

      {/* Bottom CTA */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-blue-900">
                Ready to Transform Your Operations?
              </h3>
              <p className="text-blue-700 mt-2">
                Book your strategy call to discuss your custom automation roadmap
              </p>
            </div>
            <Button 
              size="lg" 
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => window.open('https://calendly.com/your-booking-link', '_blank')}
            >
              Book Your Call
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Subcomponents
const ValueMetric: React.FC<{
  icon: any;
  value: string;
  label: string;
}> = ({ icon: Icon, value, label }) => (
  <div>
    <div className="flex items-center justify-center mb-2">
      <Icon className="h-6 w-6" />
    </div>
    <div className="text-3xl font-bold">{value}</div>
    <div className="text-sm opacity-90">{label}</div>
  </div>
);

const QuickActionCard: React.FC<{
  title: string;
  description: string;
  ctaText: string;
}> = ({ title, description, ctaText }) => (
  <Card>
    <CardContent className="p-6">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <Button 
        variant="outline" 
        className="w-full"
        onClick={() => window.open('https://calendly.com/your-booking-link', '_blank')}
      >
        {ctaText}
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </CardContent>
  </Card>
);

export default ConversionWrapper;