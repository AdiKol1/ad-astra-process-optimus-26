import React from 'react';
import { Shield, Award, Cpu, Lock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const TrustIndicators = () => {
  return (
    <div className="space-y-4">
      <Card className="bg-space-light/50 backdrop-blur-sm">
        <CardContent className="p-4 space-y-3">
          <TrustBadge 
            icon={Shield}
            text="Enterprise-Grade Security"
            subtext="SOC 2 Type II Certified"
          />
          <TrustBadge 
            icon={Lock}
            text="Advanced Data Protection"
            subtext="Bank-level encryption"
          />
          <TrustBadge 
            icon={Cpu}
            text="AI-Powered Technology"
            subtext="Latest automation capabilities"
          />
          <TrustBadge 
            icon={Award}
            text="Industry Leading Platform"
            subtext="Built for scalability"
          />
        </CardContent>
      </Card>

      {/* Value Proposition Card */}
      <Card className="bg-space-light/30 backdrop-blur-sm">
        <CardContent className="p-4">
          <h4 className="font-medium mb-3 text-white">Why Choose Our Platform</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            <li className="flex items-center gap-2">
              <div className="w-1 h-1 bg-gold rounded-full" />
              <span>Free initial consultation & assessment</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1 h-1 bg-gold rounded-full" />
              <span>Dedicated implementation specialist</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1 h-1 bg-gold rounded-full" />
              <span>Comprehensive training & support</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1 h-1 bg-gold rounded-full" />
              <span>Regular platform updates & improvements</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Technology Features */}
      <Card className="bg-space-light/50 backdrop-blur-sm">
        <CardContent className="p-4">
          <h4 className="font-medium mb-3 text-white">Platform Capabilities</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            <li className="flex items-center gap-2">
              <div className="w-1 h-1 bg-gold rounded-full" />
              <span>Custom workflow automation</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1 h-1 bg-gold rounded-full" />
              <span>Integration with major platforms</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1 h-1 bg-gold rounded-full" />
              <span>Real-time analytics dashboard</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1 h-1 bg-gold rounded-full" />
              <span>Advanced process optimization</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

const TrustBadge = ({ icon: Icon, text, subtext }: {
  icon: React.ElementType;
  text: string;
  subtext: string;
}) => (
  <div className="flex items-center gap-3">
    <div className="h-10 w-10 rounded-full bg-gold/10 flex items-center justify-center">
      <Icon className="h-5 w-5 text-gold" />
    </div>
    <div>
      <div className="font-medium text-white">{text}</div>
      <div className="text-sm text-gold">{subtext}</div>
    </div>
  </div>
);

export default TrustIndicators;